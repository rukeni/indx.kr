import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { getPostBySlug } from '@internal/lib/blog';

import { MDXComponents } from '../../../components/MDXComponents';

interface PostPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;
  const post = await getPostBySlug(category, decodeURIComponent(slug));

  if (!post) {
    notFound();

    return null;
  }

  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
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
  );
}
