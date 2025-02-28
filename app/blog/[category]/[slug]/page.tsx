import type { JSX } from 'react';

import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { MDXComponents } from '@internal/components/mdx-components';
import { getPostBySlug, extractTableOfContents } from '@internal/lib/blog';
import { TableOfContents } from '@internal/components/toc/table-of-contents';

interface PostPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function PostPage({
  params,
}: PostPageProps): Promise<JSX.Element | null> {
  const { category, slug } = await params;
  const post = await getPostBySlug(category, decodeURIComponent(slug));

  if (!post) {
    notFound();

    return null;
  }

  // 마크다운 콘텐츠에서 목차 추출
  const tableOfContents = await extractTableOfContents(post.content);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 목차 - 넓은 화면에서만 표시 */}
        <div className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
          <TableOfContents toc={tableOfContents} />
        </div>

        {/* 본문 내용 */}
        <article className="flex-1 max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{post.category}</span>
            </div>
          </header>
          <div className="prose prose-lg max-w-none">
            <MDXRemote components={MDXComponents} source={post.content} />
          </div>
        </article>
      </div>
    </div>
  );
}
