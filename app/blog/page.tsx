import type { JSX } from 'react';

import { getAllPosts } from '@internal/lib/blog';
import BlogTable from '@/components/blog/blog-table';

export default async function BlogPage(): Promise<JSX.Element> {
  const posts = await getAllPosts();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <BlogTable posts={posts} />
    </div>
  );
}
