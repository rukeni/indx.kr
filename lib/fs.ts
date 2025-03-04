'use server';

import fs from 'fs';
import path from 'path';

const POSTS_PATH = path.join(process.cwd(), 'app/blog');

// 캐싱을 위한 인터페이스 및 구현
interface Cache<T> {
  get(key: string): T | undefined;
  set(key: string, value: T): void;
  has(key: string): boolean;
  clear(): void;
}

class MemoryCache<T> implements Cache<T> {
  private cache = new Map<string, { value: T; timestamp: number }>();

  private ttl: number; // 캐시 유효 시간 (밀리초)

  constructor(ttl = 3600000) {
    // 기본 1시간
    this.ttl = ttl;
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) return undefined;

    // TTL 체크
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);

      return undefined;
    }

    return item.value;
  }

  set(key: string, value: T): void {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  has(key: string): boolean {
    if (!this.cache.has(key)) return false;

    const item = this.cache.get(key);

    if (!item) return false;

    // TTL 체크
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);

      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }
}

// 캐시 인스턴스 생성
const categoriesCache = new MemoryCache<string[]>(3600000); // 1시간
const categoryFilesCache = new MemoryCache<string[]>(3600000); // 1시간
const fileContentCache = new MemoryCache<string>(3600000); // 1시간
const slugMappingCache = new MemoryCache<Record<string, string>>(3600000); // 1시간

interface FileSystem {
  readDirectory: (dirPath: string) => Promise<string[]>;
  isDirectory: (path: string) => Promise<boolean>;
  readFile: (filePath: string) => Promise<string>;
}

class NodeFileSystem implements FileSystem {
  async readDirectory(dirPath: string): Promise<string[]> {
    return fs.readdirSync(dirPath);
  }

  async isDirectory(path: string): Promise<boolean> {
    return fs.statSync(path).isDirectory();
  }

  async readFile(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }
}

const fileSystem = new NodeFileSystem();

export async function getCategories(): Promise<string[]> {
  // 캐시 확인
  const cacheKey = 'all-categories';

  if (categoriesCache.has(cacheKey)) {
    return categoriesCache.get(cacheKey) as string[];
  }

  try {
    const paths = await fileSystem.readDirectory(POSTS_PATH);
    const categories = [];

    for (const path of paths) {
      if (await fileSystem.isDirectory(`${POSTS_PATH}/${path}`)) {
        categories.push(path);
      }
    }

    // 결과 캐싱
    categoriesCache.set(cacheKey, categories);

    return categories;
  } catch {
    return [];
  }
}

export async function getCategoryFiles(category: string): Promise<string[]> {
  // 캐시 확인
  const cacheKey = `category-files-${category}`;

  if (categoryFilesCache.has(cacheKey)) {
    return categoryFilesCache.get(cacheKey) as string[];
  }

  try {
    const categoryPath = path.join(POSTS_PATH, category);
    const files = await fileSystem.readDirectory(categoryPath);
    const mdxFiles = files.filter((file) => /\.mdx?$/.test(file));

    // 결과 캐싱
    categoryFilesCache.set(cacheKey, mdxFiles);

    return mdxFiles;
  } catch {
    return [];
  }
}

export async function readPostFile(
  category: string,
  fileName: string,
): Promise<string | null> {
  // 캐시 확인
  const cacheKey = `file-content-${category}-${fileName}`;

  if (fileContentCache.has(cacheKey)) {
    return fileContentCache.get(cacheKey) as string;
  }

  try {
    const filePath = path.join(POSTS_PATH, category, fileName);
    const content = await fileSystem.readFile(filePath);

    // 결과 캐싱
    fileContentCache.set(cacheKey, content);

    return content;
  } catch {
    return null;
  }
}

// 한글 slug와 원본 slug 매핑을 위한 새로운 함수
export async function getSlugMappings(
  category: string,
): Promise<Record<string, string>> {
  const cacheKey = `slug-mappings-${category}`;

  if (slugMappingCache.has(cacheKey)) {
    return slugMappingCache.get(cacheKey) as Record<string, string>;
  }

  const files = await getCategoryFiles(category);
  const mappings: Record<string, string> = {};

  for (const file of files) {
    const content = await readPostFile(category, file);

    if (!content) continue;

    // 간단한 정규식으로 koreanSlug 추출
    const koreanSlugMatch = content.match(/koreanSlug:\s*['"](.+)['"]/);

    if (koreanSlugMatch && koreanSlugMatch[1]) {
      const originalSlug = file.replace(/\.mdx?$/, '');

      mappings[koreanSlugMatch[1]] = originalSlug;
    }
  }

  slugMappingCache.set(cacheKey, mappings);

  return mappings;
}

// 캐시 무효화 함수 (필요시 사용)
export async function invalidateCache(): Promise<void> {
  categoriesCache.clear();
  categoryFilesCache.clear();
  fileContentCache.clear();
  slugMappingCache.clear();
}
