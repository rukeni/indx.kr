import Image from 'next/image';

import { getAllPosts } from '@internal/lib/blog';
import { Button } from '@internal/components/ui/button';
import { PostList } from '@internal/components/post-list';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
      <header className="flex items-center justify-between p-6 bg-white">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold">indx.kr</span>
        </div>
        <nav>
          <Button variant="ghost">About</Button>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to indx.kr</h1>
          <p className="text-xl text-gray-600 mb-8">
            A blog about technology, life, and everything in between.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              GitHub
            </a>
          </div>
        </div>
        <PostList posts={posts} />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <Button variant="ghost">Terms</Button>
        <Button variant="ghost">Privacy</Button>
      </footer>
    </div>
  );
}
