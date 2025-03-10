import type { NextRequest } from 'next/server';

import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL 파라미터가 필요합니다' },
      { status: 400 },
    );
  }

  try {
    // URL이 유효한지 확인
    new URL(url);
  } catch {
    return NextResponse.json(
      { error: '유효한 URL이 아닙니다' },
      { status: 400 },
    );
  }

  try {
    // URL에서 HTML 내용 가져오기
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; URLPreview/1.0)',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'URL에서 콘텐츠를 가져올 수 없습니다' },
        { status: 500 },
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // OpenGraph 및 메타데이터 추출
    const getMetaContent = (name: string, property: string): string => {
      return (
        $(`meta[name="${name}"]`).attr('content') ||
        $(`meta[property="${property}"]`).attr('content') ||
        $(`meta[property="${property.toLowerCase()}"]`).attr('content') ||
        ''
      );
    };

    // 필요한 메타데이터 가져오기
    const title =
      getMetaContent('title', 'og:title') || $('title').text() || '';
    const description = getMetaContent('description', 'og:description') || '';
    const image = getMetaContent('image', 'og:image') || '';
    const favicon =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      new URL('/favicon.ico', url).href;

    // 상대 URL을 절대 URL로 변환
    const resolveUrl = (baseUrl: string, relativeUrl: string): string => {
      try {
        return new URL(relativeUrl, baseUrl).href;
      } catch {
        return relativeUrl;
      }
    };

    // 응답 객체 생성
    const result = {
      title: title.trim(),
      description: description.trim(),
      image: image ? resolveUrl(url, image) : '',
      url,
      favicon: favicon ? resolveUrl(url, favicon) : '',
    };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'URL 미리보기를 처리하는 중 오류가 발생했습니다' },
      { status: 500 },
    );
  }
}
