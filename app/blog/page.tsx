import Link from 'next/link';

import { getAllPosts } from '@/lib/blog';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-8">
        {posts.map((post) => (
          <article
            key={`${post.category}/${post.slug}`}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <Link
              href={`/blog/${post.category}/${post.slug}`}
              className="block"
            >
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{post.category}</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
