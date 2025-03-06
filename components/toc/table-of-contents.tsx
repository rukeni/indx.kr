'use client';

import type { JSX } from 'react';

import type { TableOfContents as TOCType } from '@internal/lib/blog';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ListOrderedIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { cn } from '@internal/lib/utils';

interface TableOfContentsProps {
  toc: TOCType[];
  className?: string;
  title?: string;
}

export function TableOfContents({
  toc,
  className,
  title = '목차',
}: TableOfContentsProps): JSX.Element | null {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);

  // 클라이언트 사이드에서만 실행되도록 마운트 상태 관리
  useEffect(() => {
    setMounted(true);
  }, []);

  // 스크롤 위치에 따라 활성화된 헤더를 업데이트
  useEffect(() => {
    if (!toc.length || !mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px', threshold: 0.1 },
    );

    // 모든 헤더 요소 관찰
    const observeHeaders = (): void => {
      // 재귀적으로 헤더 ID 수집
      const collectHeaderIds = (items: TOCType[]): string[] => {
        return items.flatMap((item) => {
          const ids = [item.id];

          if (item.children?.length) {
            ids.push(...collectHeaderIds(item.children));
          }

          return ids;
        });
      };

      const ids = collectHeaderIds(toc);

      ids.forEach((id) => {
        const element = document.getElementById(id);

        if (element) {
          observer.observe(element);
        }
      });
    };

    // 약간의 지연 후 관찰 시작 (렌더링 완료를 보장)
    const timer = setTimeout(observeHeaders, 100);

    return (): void => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [toc, mounted]);

  // 목차가 비어있으면 렌더링하지 않음
  if (!toc.length) {
    return null;
  }

  // 목차 아이템 렌더링 함수
  const renderTOCItems = (items: TOCType[]): JSX.Element[] => {
    return items.map((item) => (
      <li key={item.id} className="mt-2">
        <Link
          href={`${pathname}#${item.id}`}
          className={cn(
            'block truncate transition-all hover:text-primary relative',
            activeId === item.id
              ? 'font-medium text-primary'
              : 'text-muted-foreground',
            // 계층 구조에 따른 스타일 차별화
            item.level === 1 && 'text-base font-semibold',
            item.level === 2 &&
              'text-sm pl-5 before:content-["•"] before:absolute before:left-1 before:text-muted-foreground/70',
            item.level === 3 &&
              'text-xs pl-10 before:content-["◦"] before:absolute before:left-6 before:text-muted-foreground/60',
            item.level === 4 &&
              'text-xs pl-16 before:content-["▫"] before:absolute before:left-12 before:text-muted-foreground/50',
            item.level >= 5 &&
              'text-xs pl-20 before:content-["▪"] before:absolute before:left-16 before:text-muted-foreground/40',
          )}
        >
          {item.text}
        </Link>
        {item.children?.length ? (
          <ul className="mt-1 border-l border-l-slate-200 ml-2">
            {renderTOCItems(item.children)}
          </ul>
        ) : null}
      </li>
    ));
  };

  return (
    <div
      className={cn(
        'w-full max-w-[280px] bg-white border rounded-lg shadow-md',
        className,
      )}
    >
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 py-3 px-4 border-b bg-slate-50">
          <ListOrderedIcon className="h-5 w-5 text-slate-600" />
          <h3 className="text-sm font-medium text-slate-800">{title}</h3>
        </div>
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {mounted ? (
            <ul className="space-y-2">{renderTOCItems(toc)}</ul>
          ) : (
            <div className="text-sm text-gray-500">{title} 로딩 중...</div>
          )}
        </div>
      </div>
    </div>
  );
}
