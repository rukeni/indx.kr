'use client';

import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { LinkIcon, ExternalLinkIcon, GlobeIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Skeleton } from './skeleton';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

export interface UrlBookmarkProps {
  initialUrl?: string;
  className?: string;
  onUrlChange?: (url: string) => void;
}

interface UrlPreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
  favicon: string;
}

export function UrlBookmark({
  initialUrl = '',
  className,
  onUrlChange,
}: UrlBookmarkProps): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [previewData, setPreviewData] = useState<UrlPreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // URL이 변경될 때 미리보기 데이터를 가져오는 함수
  const fetchPreviewData = async (urlToFetch: string): Promise<void> => {
    if (!urlToFetch) return;

    setIsLoading(true);
    setError(null);

    try {
      // API 호출
      const response = await fetch(
        `/api/url-preview?url=${encodeURIComponent(urlToFetch)}`,
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.error || 'URL 프리뷰를 불러오는 데 실패했습니다',
        );
      }

      const data = await response.json();

      setPreviewData(data);

      if (onUrlChange) {
        onUrlChange(urlToFetch);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'URL 프리뷰를 불러오는 데 실패했습니다',
      );
      setPreviewData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 URL이 있는 경우 컴포넌트 마운트 시 미리보기 데이터 가져오기
  useEffect(() => {
    if (initialUrl && initialUrl.trim() !== '') {
      fetchPreviewData(initialUrl);
    }
  }, [initialUrl]);

  // 로딩 상태
  if (isLoading) {
    return (
      <Card
        className={cn(
          'w-full overflow-hidden hover:shadow-md rounded-none transition-shadow',
          className,
        )}
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-40 relative">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="flex-1 md:w-2/3">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardFooter className="pt-0">
              <Skeleton className="h-4 w-1/3" />
            </CardFooter>
          </div>
        </div>
      </Card>
    );
  }

  // 오류 상태
  if (error) {
    return (
      <Card
        className={cn(
          'w-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer',
          className,
        )}
        onClick={() => window.open(initialUrl, '_blank', 'noopener,noreferrer')}
      >
        <CardHeader>
          <CardTitle className="text-lg text-red-500">
            미리보기를 불러올 수 없습니다
          </CardTitle>
          <CardDescription>
            <span className="flex items-center text-sm text-blue-500">
              <LinkIcon className="h-3 w-3 mr-1" />
              {initialUrl}
              <ExternalLinkIcon className="h-3 w-3 ml-1" />
            </span>
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // 데이터가 없는 경우
  if (!previewData) {
    return (
      <Card
        className={cn(
          'w-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer',
          className,
        )}
        onClick={() => window.open(initialUrl, '_blank', 'noopener,noreferrer')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <GlobeIcon className="h-4 w-4" />
            외부 링크
          </CardTitle>
        </CardHeader>
        <CardFooter className="pt-0">
          <span className="flex items-center text-sm text-blue-500">
            <LinkIcon className="h-3 w-3 mr-1" />
            {initialUrl}
            <ExternalLinkIcon className="h-3 w-3 ml-1" />
          </span>
        </CardFooter>
      </Card>
    );
  }

  // 정상 상태
  return (
    <Card
      className={cn(
        'w-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer',
        className,
      )}
      onClick={() =>
        window.open(previewData.url, '_blank', 'noopener,noreferrer')
      }
    >
      <div className="flex flex-col md:flex-row">
        {previewData.image && (
          <div className="md:w-1/3 h-40 relative">
            <Image
              src={previewData.image}
              alt={previewData.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <div
          className={cn('flex-1', previewData.image ? 'md:w-2/3' : 'w-full')}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {previewData.favicon && (
                <Image
                  src={previewData.favicon}
                  alt="favicon"
                  width={16}
                  height={16}
                  className="rounded-sm"
                  unoptimized
                />
              )}
              <CardTitle className="text-lg">{previewData.title}</CardTitle>
            </div>
            <CardDescription className="line-clamp-2">
              {previewData.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <span className="flex items-center text-sm text-blue-500">
              <LinkIcon className="h-3 w-3 mr-1" />
              {new URL(previewData.url).hostname}
              <ExternalLinkIcon className="h-3 w-3 ml-1" />
            </span>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
