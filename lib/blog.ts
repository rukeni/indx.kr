'use server';

import matter from 'gray-matter';

import { getCategories, getCategoryFiles, readPostFile } from './fs';

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
  metadata?: Record<string, unknown>;
  tags?: string[];
  readingTime?: number; // 분 단위
  series?: string;
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

        posts.push({
          ...data,
          slug,
          koreanSlug: data.koreanSlug,
          category,
          content,
          status: data.status || 'in progress',
          priority: data.priority || 'medium',
          // 새로운 필드들
          tags: data.tags || [],
          readingTime: data.readingTime || readingTime,
          series: data.series || null,
        } as Post);
      }
    }

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch {
    return [];
  }
}

export async function getPostBySlug(
  category: string,
  slug: string,
): Promise<Post | null> {
  try {
    // 먼저 일반 slug로 검색
    const files = await getCategoryFiles(category);
    const file = files.find((f) => f.replace(/\.mdx?$/, '') === slug);

    if (file) {
      const source = await readPostFile(category, file);

      if (!source) return null;

      const { data, content } = matter(source);

      // 읽기 시간 자동 계산 (평균 읽기 속도: 분당 200단어)
      const wordCount = content.trim().split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200);

      return {
        ...data,
        slug,
        category,
        content,
        // 새로운 필드들
        tags: data.tags || [],
        readingTime: data.readingTime || readingTime,
        series: data.series || null,
      } as Post;
    }

    // 한글 slug로 검색
    for (const file of files) {
      const source = await readPostFile(category, file);

      if (!source) continue;

      const { data } = matter(source);

      if (data.koreanSlug === slug) {
        const { content } = matter(source);
        const originalSlug = file.replace(/\.mdx?$/, '');

        // 읽기 시간 자동 계산 (평균 읽기 속도: 분당 200단어)
        const wordCount = content.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);

        return {
          ...data,
          slug: originalSlug,
          koreanSlug: data.koreanSlug,
          category,
          content,
          // 새로운 필드들
          tags: data.tags || [],
          readingTime: data.readingTime || readingTime,
          series: data.series || null,
        } as Post;
      }
    }

    return null;
  } catch {
    return null;
  }
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
        ...data,
        slug,
        category,
        content,
        // 새로운 필드들
        tags: data.tags || [],
        readingTime: data.readingTime || readingTime,
        series: data.series || null,
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
): Promise<TableOfContents[]> {
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

    // 헤더 ID 생성 (텍스트를 소문자로 변환하고 공백을 하이픈으로 변경)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거 (한글 포함)
      .replace(/\s+/g, '-'); // 공백을 하이픈으로 변경

    // 헤더 객체 생성
    const header: TableOfContents = { id, text, level, children: [] };

    // 부모-자식 관계 구성 (h1 -> h2 -> h3 등)
    if (level === 1) {
      toc.push(header);
    } else {
      // 현재 헤더보다 레벨이 낮은(상위) 가장 가까운 헤더 찾기
      let parent = toc[toc.length - 1];

      // 부모 찾기
      for (let i = toc.length - 1; i >= 0; i--) {
        const potentialParent = toc[i];

        if (potentialParent.level < level) {
          parent = potentialParent;
          break;
        }
      }

      // 계층 구조 구성
      if (parent && parent.level < level) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(header);
      } else {
        // 적절한 부모가 없으면 최상위 레벨에 추가
        toc.push(header);
      }
    }
  }

  return toc;
}
