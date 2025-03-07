'use client';

import type { JSX } from 'react';

import type { TableOfContents as TOCType } from '@internal/lib/blog';

import Link from 'next/link';
import React, { useState } from 'react';
import { BookOpenIcon } from 'lucide-react';

import { cn } from '@internal/lib/utils';

interface SeriesOfContentsProps {
  toc: TOCType[];
  className?: string;
  title?: string;
  seriesId?: string;
}

export function SeriesOfContents({
  toc,
  className,
  title = '시리즈 목록',
  seriesId,
}: SeriesOfContentsProps): JSX.Element | null {
  const [mounted, setMounted] = useState<boolean>(false);

  // 클라이언트 사이드에서만 실행되도록 마운트 상태 관리
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 목차가 비어있으면 렌더링하지 않음
  if (!toc.length) {
    return null;
  }

  const renderTOCItems = (items: TOCType[]): JSX.Element[] => {
    return items.map((item) => {
      // 시리즈 제목(level 1)인 경우 메인 페이지로 이동하면서 시리즈 필터링
      const href = item.level === 1 ? `/?series=${seriesId}` : `#${item.id}`;

      return (
        <li
          key={item.id}
          className={cn(
            'mt-2  ',
            item.level === 1 && 'mt-4',
            item.level === 2 &&
              'before:content-["•"] before:absolute before:left-1 before:text-muted-foreground/70',
          )}
        >
          <Link
            href={href}
            className={cn(
              'inline-block no-underline transition-colors hover:text-foreground',
              item.level === 1
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground font-normal',
            )}
          >
            {item.text}
          </Link>
          {item.children && item.children.length > 0 && (
            <ul className="ml-4 text-sm">{renderTOCItems(item.children)}</ul>
          )}
        </li>
      );
    });
  };

  if (!mounted) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 font-semibold">
        <BookOpenIcon className="h-5 w-5" />
        <span>{title}</span>
      </div>
      <ul className="mt-4">{renderTOCItems(toc)}</ul>
    </div>
  );
}
