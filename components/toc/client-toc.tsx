'use client';

import type { JSX } from 'react';

import type { TableOfContents } from '@internal/lib/blog';

import dynamic from 'next/dynamic';

// 클라이언트 컴포넌트를 동적으로 임포트 (클라이언트 사이드에서만 렌더링)
const DynamicTableOfContents = dynamic(
  () =>
    import('@internal/components/toc/table-of-contents').then(
      (mod) => mod.TableOfContents,
    ),
  {
    loading: () => (
      <div className="w-[280px] h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
    ),
    ssr: false, // 클라이언트 사이드에서만 렌더링하여 초기 로드 시간 단축
  },
);

interface ClientTOCProps {
  toc: TableOfContents[];
}

export function ClientTOC({ toc }: ClientTOCProps): JSX.Element {
  return <DynamicTableOfContents toc={toc} />;
}
