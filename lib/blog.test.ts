import type { FileSystem } from './fs';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { getCategories, getCategoryFiles, readPostFile } from './fs';
import {
  getAllPosts,
  getPostBySlug,
  getPostsByCategory,
  getAllCategories,
} from './blog';

vi.mock('./fs', () => {
  const mockFileSystem: FileSystem = {
    readDirectory: vi.fn(),
    isDirectory: vi.fn(),
    readFile: vi.fn(),
  };

  return {
    fileSystem: mockFileSystem,
    POSTS_PATH: '/mock/cwd/app/posts',
    getCategories: vi.fn(),
    getCategoryFiles: vi.fn(),
    readPostFile: vi.fn(),
  };
});

type MockPosts = {
  [category: string]: {
    [fileName: string]: string;
  };
};

const mockPosts: MockPosts = {
  tech: {
    'hello-world.mdx': `---
title: '첫 번째 기술 블로그 포스트'
date: '2024-02-22'
description: 'Next.js와 MDX를 사용한 기술 블로그 시스템 구축하기'
---
테스트 콘텐츠`,
    'second-post.mdx': `---
title: '두 번째 포스트'
date: '2024-02-23'
description: '두 번째 포스트 설명'
---
두 번째 포스트 내용`,
  },
  life: {
    'my-story.mdx': `---
title: '내 이야기'
date: '2024-02-21'
description: '일상 이야기'
---
일상 포스트 내용`,
  },
};

describe('Blog Utilities', () => {
  beforeEach(() => {
    vi.mocked(getCategories).mockImplementation(() => {
      return Object.keys(mockPosts);
    });

    vi.mocked(getCategoryFiles).mockImplementation((category: string) => {
      return Object.keys(mockPosts[category] || {});
    });

    vi.mocked(readPostFile).mockImplementation(
      (category: string, fileName: string) => {
        return mockPosts[category]?.[fileName] || null;
      },
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllPosts', () => {
    it('should return all posts sorted by date', () => {
      const posts = getAllPosts();

      expect(posts).toHaveLength(3);
      expect(posts[0].title).toBe('두 번째 포스트');
      expect(posts[1].title).toBe('첫 번째 기술 블로그 포스트');
      expect(posts[2].title).toBe('내 이야기');
    });
  });

  describe('getPostBySlug', () => {
    it('should return post by category and slug', () => {
      const post = getPostBySlug('tech', 'hello-world');

      expect(post).toBeTruthy();
      expect(post?.title).toBe('첫 번째 기술 블로그 포스트');
      expect(post?.category).toBe('tech');
      expect(post?.slug).toBe('hello-world');
    });

    it('should return null for non-existent post', () => {
      const post = getPostBySlug('tech', 'non-existent');

      expect(post).toBeNull();
    });
  });

  describe('getPostsByCategory', () => {
    it('should return all posts in a category sorted by date', () => {
      const posts = getPostsByCategory('tech');

      expect(posts).toHaveLength(2);
      expect(posts[0].title).toBe('두 번째 포스트');
      expect(posts[1].title).toBe('첫 번째 기술 블로그 포스트');
    });

    it('should return empty array for non-existent category', () => {
      const posts = getPostsByCategory('non-existent');

      expect(posts).toHaveLength(0);
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', () => {
      const categories = getAllCategories();

      expect(categories).toEqual(['tech', 'life']);
    });
  });
});
