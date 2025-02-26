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
