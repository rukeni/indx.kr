'use client';

import type { Post } from '@internal/lib/blog';

import Link from 'next/link';

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.category}/${post.koreanSlug || post.slug}`}
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-4">{post.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span>{new Date(post.date).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span className="capitalize">{post.category}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
