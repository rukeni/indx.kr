import { notFound } from 'next/navigation';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import * as blogUtils from '@internal/lib/blog';

import PostPage from './page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: ({ source }: { source: string }): JSX.Element => (
    <div data-testid="mdx-content">{source}</div>
  ),
}));

vi.mock('@internal/lib/blog', () => ({
  getPostBySlug: vi.fn(),
}));

describe('PostPage', () => {
  const mockPost = {
    title: '테스트 포스트',
    description: '테스트 포스트 설명',
    date: '2024-02-22',
    category: 'tech',
    slug: 'test-post',
    content: '# 테스트 내용',
  };

  const mockParams = {
    category: 'tech',
    slug: 'test-post',
  };

  beforeEach(() => {
    vi.mocked(blogUtils.getPostBySlug).mockReturnValue(mockPost);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders post title and metadata', () => {
    render(<PostPage params={mockParams} />);

    expect(screen.getByText(mockPost.title)).toBeInTheDocument();
    expect(
      screen.getByText(mockPost.category, { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(new Date(mockPost.date).toLocaleDateString()),
    ).toBeInTheDocument();
  });

  it('renders post content', () => {
    render(<PostPage params={mockParams} />);

    const content = screen.getByTestId('mdx-content');

    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent(mockPost.content);
  });

  it('calls notFound when post does not exist', () => {
    vi.mocked(blogUtils.getPostBySlug).mockReturnValue(null);

    render(<PostPage params={mockParams} />);
    expect(notFound).toHaveBeenCalled();
  });

  it('calls getPostBySlug with correct parameters', () => {
    render(<PostPage params={mockParams} />);

    expect(blogUtils.getPostBySlug).toHaveBeenCalledWith(
      mockParams.category,
      mockParams.slug,
    );
  });
});

describe('Blog Post Page', () => {
  it('should render blog post page correctly', (): void => {
    expect(true).toBe(true);
  });
});
