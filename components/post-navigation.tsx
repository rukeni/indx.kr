'use client';

import type { JSX } from 'react';

import type { AdjacentPost } from '@/lib/blog';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PostNavigationProps {
  previous: AdjacentPost | null;
  next: AdjacentPost | null;
}

export function PostNavigation({
  previous,
  next,
}: PostNavigationProps): JSX.Element {
  return (
    <nav className="flex justify-between items-center mt-8 py-8 border-t border-gray-200 dark:border-gray-700">
      {previous ? (
        <Link
          href={`/blog/${previous.category}/${previous.koreanSlug || previous.slug}`}
          className="flex items-center group max-w-[45%]"
        >
          <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1 flex-shrink-0" />
          <div className="overflow-hidden">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              이전 글
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {previous.category}
            </div>
            <div className="font-medium group-hover:text-primary truncate">
              {previous.title}
            </div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/blog/${next.category}/${next.koreanSlug || next.slug}`}
          className="flex items-center text-right group max-w-[45%] ml-auto"
        >
          <div className="overflow-hidden">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              다음 글
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {next.category}
            </div>
            <div className="font-medium group-hover:text-primary truncate">
              {next.title}
            </div>
          </div>
          <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 flex-shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
