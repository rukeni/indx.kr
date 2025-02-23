import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import * as blogUtils from '@internal/lib/blog';

import BlogPage from './page';

vi.mock('@internal/lib/blog', () => ({
  getAllPosts: vi.fn(),
}));

describe('BlogPage', () => {
  const mockPosts = [
    {
      title: '첫 번째 포스트',
      description: '첫 번째 포스트 설명',
      date: '2024-02-22',
      category: 'tech',
      slug: 'first-post',
    },
    {
      title: '두 번째 포스트',
      description: '두 번째 포스트 설명',
      date: '2024-02-23',
      category: 'life',
      slug: 'second-post',
    },
  ];

  beforeEach(() => {
    vi.mocked(blogUtils.getAllPosts).mockReturnValue(mockPosts);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders blog title', () => {
    render(<BlogPage />);
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('renders all blog posts', () => {
    render(<BlogPage />);

    mockPosts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.description)).toBeInTheDocument();
      expect(
        screen.getByText(post.category, { exact: false }),
      ).toBeInTheDocument();
    });
  });

  it('renders posts in correct order', () => {
    render(<BlogPage />);

    const titles = screen
      .getAllByRole('heading', { level: 2 })
      .map((h) => h.textContent);

    expect(titles).toEqual(mockPosts.map((p) => p.title));
  });

  it('renders post dates in correct format', () => {
    render(<BlogPage />);

    mockPosts.forEach((post) => {
      const date = new Date(post.date).toLocaleDateString();

      expect(screen.getByText(date)).toBeInTheDocument();
    });
  });
});
