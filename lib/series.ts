import type { Post, TableOfContents } from './blog';

export interface SeriesPost {
  title: string;
  slug: string;
  category: string;
  koreanSlug?: string;
  order: number;
}

export interface Series {
  id: string;
  title: string;
  description?: string;
  posts: SeriesPost[];
}

/**
 * 시리즈 포스트 목록을 TOC 형식으로 변환하는 함수
 */
export function convertSeriesToTOC(
  series: Series,
  currentPostSlug?: string,
): TableOfContents[] {
  // 시리즈 제목을 최상위 항목으로 추가
  const seriesTOC: TableOfContents[] = [
    {
      id: `series-${series.id}`,
      text: series.title,
      level: 1,
      children: series.posts
        .sort((a, b) => a.order - b.order)
        .map((post) => {
          const slug = post.koreanSlug || post.slug;

          return {
            id: `series-post-${slug}`,
            text: post.title,
            level: 2,
            // 현재 포스트인 경우 특별한 메타데이터 추가
            metadata: {
              isCurrentPost: currentPostSlug === slug,
              url: `/blog/${post.category}/${slug}`,
            },
          };
        }),
    },
  ];

  return seriesTOC;
}

/**
 * 포스트 목록에서 특정 시리즈에 속한 포스트들을 찾아서 Series 객체로 변환하는 함수
 */
export function extractSeriesFromPosts(
  posts: Post[],
  seriesId: string,
): Series | null {
  // 해당 시리즈의 포스트들 찾기
  const seriesPosts = posts.filter((post) => post.series === seriesId);

  if (seriesPosts.length === 0) {
    return null;
  }

  // 시리즈의 첫 번째 포스트에서 시리즈 메타데이터 가져오기
  const firstPost = seriesPosts[0];

  return {
    id: seriesId,
    title: firstPost.seriesTitle || seriesId,
    description: firstPost.seriesDescription,
    posts: seriesPosts.map((post) => ({
      title: post.title,
      slug: post.slug,
      category: post.category,
      koreanSlug: post.koreanSlug,
      order: post.seriesOrder || 0,
    })),
  };
}
