'use client';

import { useState } from 'react';

import { UrlBookmark } from '@/components/ui/url-bookmark';

interface ReferencesSectionProps {
  urls: string[];
}

/**
 * 문서 하단에 표시할 참고자료 섹션 컴포넌트
 * 추출된 URL들을 북마크 형태로 보여줍니다.
 */
export function ReferencesSection({ urls }: ReferencesSectionProps) {
  const [expandedUrls, setExpandedUrls] = useState<string[]>([]);

  // 참조할 URL이 없으면 아무것도 렌더링하지 않음
  if (!urls.length) return null;

  // 확장/축소 토글 핸들러
  const toggleExpand = (url: string) => {
    setExpandedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
    );
  };

  return (
    <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6">참고자료</h2>
      <div className="space-y-6">
        {urls.map((url, index) => (
          <div key={`${url}-${index}`} className="reference-item">
            {expandedUrls.includes(url) ? (
              <div>
                <UrlBookmark initialUrl={url} />
                <button
                  onClick={() => toggleExpand(url)}
                  className="text-sm text-blue-500 hover:underline mt-2"
                >
                  접기
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate flex-1"
                >
                  {url}
                </a>
                <button
                  onClick={() => toggleExpand(url)}
                  className="text-sm text-blue-500 hover:underline ml-2"
                >
                  미리보기
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
