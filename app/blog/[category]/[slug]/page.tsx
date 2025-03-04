import type { JSX } from 'react';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { MDXComponents } from '@internal/components/mdx-components';
import { getPostBySlug, extractTableOfContents } from '@internal/lib/blog';

// 클라이언트 컴포넌트를 동적으로 임포트
const DynamicTableOfContents = dynamic(
  () =>
    import('@internal/components/toc/table-of-contents').then(
      (mod) => mod.TableOfContents,
    ),
  {
    loading: () => (
      <div className="w-[280px] h-[300px] bg-gray-100 rounded-lg animate-pulse"></div>
    ),
  },
);

interface PostPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// 정적 생성을 위한 ISR 설정
export const revalidate = 3600; // 1시간마다 재검증

// 로딩 컴포넌트
function LoadingContent(): JSX.Element {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
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

  // 마크다운 콘텐츠에서 목차 추출 (캐싱 적용)
  const postId = `${category}-${post.slug}`;
  const tableOfContents = await extractTableOfContents(post.content, postId);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 목차 - 넓은 화면에서만 표시 */}
        <div className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
          <DynamicTableOfContents toc={tableOfContents} />
        </div>

        {/* 본문 내용 */}
        <article className="flex-1 max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{post.category}</span>
              {post.readingTime && (
                <>
                  <span className="mx-2">•</span>
                  <span>읽는 시간: {post.readingTime}분</span>
                </>
              )}
            </div>
          </header>
          <div className="prose prose-lg max-w-none">
            <Suspense fallback={<LoadingContent />}>
              <MDXRemote components={MDXComponents} source={post.content} />
            </Suspense>
          </div>
        </article>
      </div>
    </div>
  );
}
