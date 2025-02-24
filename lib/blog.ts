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

        posts.push({
          ...data,
          slug,
          koreanSlug: data.koreanSlug,
          category,
          content,
          status: data.status || 'in progress',
          priority: data.priority || 'medium',
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

      return {
        ...data,
        slug,
        category,
        content,
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

        return {
          ...data,
          slug: originalSlug,
          koreanSlug: data.koreanSlug,
          category,
          content,
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

      posts.push({
        ...data,
        slug,
        category,
        content,
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
