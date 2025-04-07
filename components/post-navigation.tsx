'use client';

import type { JSX } from 'react';

import type { AdjacentPost } from '@/lib/blog';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import given from '@internal/lib/given';

interface PostNavigationProps {
  previous: AdjacentPost | null;
  next: AdjacentPost | null;
}

export function PostNavigation({
  previous,
  next,
}: PostNavigationProps): JSX.Element {
  const previousButton = given<JSX.Element>({
    cases: [
      {
        when: Boolean(previous),
        then: (
          <Link
            href={`/blog/${previous!.category}/${previous!.koreanSlug || previous!.slug}`}
            className="flex items-center group max-w-[45%]"
          >
            <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1 flex-shrink-0" />
            <div className="overflow-hidden">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                이전 글
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {previous!.category}
              </div>
              <div className="font-medium group-hover:text-primary truncate">
                {previous!.title}
              </div>
            </div>
          </Link>
        ),
      },
    ],
    defaultValue: <div />,
  });

  const nextButton = given<JSX.Element>({
    cases: [
      {
        when: Boolean(next),
        then: (
          <Link
            href={`/blog/${next!.category}/${next!.koreanSlug || next!.slug}`}
            className="flex items-center text-right group max-w-[45%] ml-auto"
          >
            <div className="overflow-hidden">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                다음 글
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {next!.category}
              </div>
              <div className="font-medium group-hover:text-primary truncate">
                {next!.title}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 flex-shrink-0" />
          </Link>
        ),
      },
    ],
    defaultValue: <div />,
  });

  return (
    <nav className="flex justify-between items-center mt-8 py-8 border-t border-gray-200 dark:border-gray-700">
      {previousButton}
      {nextButton}
    </nav>
  );
}
