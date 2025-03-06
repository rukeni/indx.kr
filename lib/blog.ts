'use server';

import matter from 'gray-matter';

import {
  getCategories,
  getCategoryFiles,
  readPostFile,
  getSlugMappings,
} from './fs';

// 포스트 캐싱을 위한 메모리 캐시
const postCache = new Map<string, { post: Post; timestamp: number }>();
const TOC_CACHE = new Map<
  string,
  { toc: TableOfContents[]; timestamp: number }
>();
const CACHE_TTL = 3600000; // 1시간

export type SeriesMetadata = {
  title: string;
  description?: string;
  order: number;
};

export type PostMetadata = {
  series?: SeriesMetadata;
  [key: string]: unknown;
};

export type Post = {
  slug: string;
  koreanSlug?: string;
  category: string;
  title: string;
  date: string;
  description: string;
  content: string;
  status?: 'backlog' | 'todo' | 'in progress' | 'done' | 'canceled';
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  readingTime?: number;
  // 시리즈 관련 필드 평탄화
  series?: string;
  seriesTitle?: string;
  seriesDescription?: string;
  seriesOrder?: number;
  tableOfContents?: TableOfContents[];
};

export async function getAllPosts(): Promise<Post[]> {
  try {
    const categories = await getCategories();
    const posts = [];

    for (const category of categories) {
      const files = await getCategoryFiles(category);

      for (const file of files) {
        const source = await readPostFile(category, file);

        if (!source) continue;

        const { data, content } = matter(source);
        const slug = file.replace(/\.mdx?$/, '');

        // 읽기 시간 자동 계산 (평균 읽기 속도: 분당 200단어)
        const wordCount = content.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);

        // 메타데이터 평탄화
        const post: Post = {
          slug,
          koreanSlug: data.koreanSlug,
          category,
          content,
          title: data.title,
          date: data.date,
          description: data.description,
          status: data.status || 'in progress',
          priority: data.priority || 'medium',
          tags: data.tags || [],
          readingTime: data.readingTime || readingTime,
          series: data.series || null,
          seriesTitle: data.seriesTitle || null,
          seriesDescription: data.seriesDescription || null,
          seriesOrder: data.seriesOrder || null,
          ...data,
        };

        posts.push(post);
      }
    }

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error('getAllPosts 에러:', error);

    return [];
  }
}

export async function getPostBySlug(
  category: string,
  slug: string,
): Promise<Post | null> {
  // 캐시 키 생성
  const cacheKey = `post-${category}-${slug}`;

  // 캐시 확인
  const cachedPost = postCache.get(cacheKey);

  if (cachedPost && Date.now() - cachedPost.timestamp < CACHE_TTL) {
    return cachedPost.post;
  }

  try {
    // 파일 찾기 함수 분리
    const { file, originalSlug } = await findPostFile(category, slug);

    if (!file) return null;

    // 포스트 데이터 로드 함수 분리
    const post = await loadPostData(category, file, originalSlug);

    if (!post) return null;

    // 결과 캐싱
    postCache.set(cacheKey, { post, timestamp: Date.now() });

    return post;
  } catch (error) {
    console.error('Error in getPostBySlug:', error);

    return null;
  }
}

// 파일 찾기 함수 분리
async function findPostFile(
  category: string,
  slug: string,
): Promise<{ file: string | undefined; originalSlug: string }> {
  // 먼저 일반 slug로 검색
  const files = await getCategoryFiles(category);
  let file = files.find((f) => f.replace(/\.mdx?$/, '') === slug);
  let originalSlug = slug;

  // 일반 slug로 찾지 못한 경우 한글 slug 매핑 사용
  if (!file) {
    const slugMappings = await getSlugMappings(category);

    originalSlug = slugMappings[slug];

    if (originalSlug) {
      file = files.find((f) => f.replace(/\.mdx?$/, '') === originalSlug);
    }
  }

  return { file, originalSlug };
}

// 포스트 데이터 로드 함수 분리
async function loadPostData(
  category: string,
  file: string,
  originalSlug: string,
): Promise<Post | null> {
  const source = await readPostFile(category, file);

  if (!source) return null;

  const { data, content } = matter(source);

  // 읽기 시간 자동 계산 (평균 읽기 속도: 분당 200단어)
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // 메타데이터 평탄화
  const post: Post = {
    slug: originalSlug,
    koreanSlug: data.koreanSlug,
    category,
    content,
    title: data.title,
    date: data.date,
    description: data.description,
    status: data.status || 'in progress',
    priority: data.priority || 'medium',
    tags: data.tags || [],
    readingTime: data.readingTime || readingTime,
    series: data.series || null,
    seriesTitle: data.seriesTitle || null,
    seriesDescription: data.seriesDescription || null,
    seriesOrder: data.seriesOrder || null,
  };

  return post;
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  try {
    const files = await getCategoryFiles(category);
    const posts = [];

    for (const file of files) {
      const source = await readPostFile(category, file);

      if (!source) continue;

      const { data, content } = matter(source);
      const slug = file.replace(/\.mdx?$/, '');

      // 읽기 시간 자동 계산 (평균 읽기 속도: 분당 200단어)
      const wordCount = content.trim().split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      posts.push({
        slug,
        koreanSlug: data.koreanSlug,
        category,
        content,
        title: data.title,
        date: data.date,
        description: data.description,
        status: data.status || 'in progress',
        priority: data.priority || 'medium',
        tags: data.tags || [],
        readingTime: data.readingTime || readingTime,
        series: data.series || null,
        seriesTitle: data.seriesTitle || null,
        seriesDescription: data.seriesDescription || null,
        seriesOrder: data.seriesOrder || null,
      } as Post);
    }

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch {
    return [];
  }
}

export async function getAllCategories(): Promise<string[]> {
  return getCategories();
}

// 마크다운 콘텐츠에서 헤더를 추출하는 함수
export type TableOfContents = {
  id: string;
  text: string;
  level: number;
  children?: TableOfContents[];
};

export async function extractTableOfContents(
  content: string,
  postId?: string,
): Promise<TableOfContents[]> {
  // 캐싱 키 (postId가 있으면 사용)
  const cacheKey = postId ? `toc-${postId}` : `toc-${content.substring(0, 50)}`;

  // 캐시 확인
  const cachedTOC = TOC_CACHE.get(cacheKey);

  if (cachedTOC && Date.now() - cachedTOC.timestamp < CACHE_TTL) {
    return cachedTOC.toc;
  }

  // 헤더 추출 및 구성 함수 분리
  const toc = extractHeaders(content);

  // 결과 캐싱
  TOC_CACHE.set(cacheKey, { toc, timestamp: Date.now() });

  return toc;
}

// 헤더 추출 함수 분리
function extractHeaders(content: string): TableOfContents[] {
  // 모든 헤더 선택 (# 형식)
  const headerRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TableOfContents[] = [];
  const matches = Array.from(content.matchAll(headerRegex));

  // 헤더가 없을 경우 빈 배열 반환
  if (!matches.length) return [];

  // 헤더 정보 구성
  for (const match of matches) {
    const level = match[1].length; // # 개수
    const text = match[2].trim();

    // 헤더 ID 생성
    const id = createHeaderId(text);

    // 헤더 객체 생성
    const header: TableOfContents = { id, text, level, children: [] };

    // 헤더 계층 구조에 추가
    addHeaderToToc(toc, header);
  }

  return toc;
}

// 헤더 ID 생성 함수
function createHeaderId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거 (한글 포함)
    .replace(/\s+/g, '-'); // 공백을 하이픈으로 변경
}

// 헤더를 목차에 추가하는 함수
function addHeaderToToc(toc: TableOfContents[], header: TableOfContents): void {
  // h1 헤더는 최상위 레벨에 추가
  if (header.level === 1) {
    toc.push(header);

    return;
  }

  // 현재 헤더보다 레벨이 낮은(상위) 가장 가까운 헤더 찾기
  const parent = findParentHeader(toc, header.level);

  // 적절한 부모가 있으면 자식으로 추가
  if (parent) {
    if (!parent.children) {
      parent.children = [];
    }
    parent.children.push(header);
  } else {
    // 적절한 부모가 없으면 최상위 레벨에 추가
    toc.push(header);
  }
}

// 부모 헤더 찾기 함수
function findParentHeader(
  toc: TableOfContents[],
  level: number,
): TableOfContents | null {
  // 배열이 비어있으면 부모가 없음
  if (toc.length === 0) return null;

  // 마지막 항목부터 역순으로 검색
  for (let i = toc.length - 1; i >= 0; i--) {
    const potentialParent = toc[i];

    // 레벨이 낮은(상위) 헤더를 찾으면 반환
    if (potentialParent.level < level) {
      return potentialParent;
    }

    // 자식 항목들도 검사
    if (potentialParent.children && potentialParent.children.length > 0) {
      const childParent = findParentHeader(potentialParent.children, level);

      if (childParent) return childParent;
    }
  }

  return null;
}
