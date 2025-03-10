'use client';

import { LinkIcon } from 'lucide-react';

import { UrlBookmark } from './url-bookmark';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';

interface UrlBookmarkListProps {
  urls: string[];
}

/**
 * URL 북마크 목록을 렌더링하는 클라이언트 컴포넌트
 * shadcn UI의 Card 컴포넌트를 활용하여 세련된 디자인 적용
 */
export function UrlBookmarkList({ urls }: UrlBookmarkListProps) {
  if (!urls || urls.length === 0) {
    return null;
  }

  return (
    <Card className="border-t-4 border-t-primary">
      <CardHeader>
        <div className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-primary" />
          <CardTitle>참고자료</CardTitle>
        </div>
        <CardDescription>
          이 글에서 참조된 외부 링크 {urls.length}개
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {urls.map((url, index) => (
            <UrlBookmark key={`${url}-${index}`} initialUrl={url} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
