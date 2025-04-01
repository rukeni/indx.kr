'use client';

import type { JSX } from 'react';

import type { Post } from '@internal/lib/blog';

import { useState, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { useMemo, useCallback } from 'react';
import { ChevronDown, Search, Clock, BookOpen } from 'lucide-react';

import given from '@/lib/given';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/table-view/data-table-column-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BlogTableProps {
  posts: Post[];
}

type SortConfig = {
  key: keyof Post | null;
  direction: 'asc' | 'desc' | null;
};

const BlogTable: FC<BlogTableProps> = ({ posts }): JSX.Element => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [seriesFilter, setSeriesFilter] = useState<string | null>(null);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'date',
    direction: 'desc',
  });

  const handleSort = (key: keyof Post): void => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // 모든 시리즈와 태그 목록 추출 (중복 제거)
  const allSeries = useMemo(() => {
    const seriesMap = new Map<string, string>();

    posts.forEach((post) => {
      if (post.series && post.seriesTitle) {
        seriesMap.set(post.series, post.seriesTitle);
      }
    });

    const result = Array.from(seriesMap.entries()).map(([id, title]) => ({
      id,
      title,
    }));

    return result;
  }, [posts]);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();

    posts.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => tagsSet.add(tag));
      }
    });

    return Array.from(tagsSet);
  }, [posts]);

  // 포스트 필터링 함수
  const filterPost = useCallback(
    (post: Post): boolean => {
      // 검색어 필터링
      if (
        searchQuery &&
        !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !post.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // 카테고리 필터링
      if (categoryFilter && post.category !== categoryFilter) {
        return false;
      }

      // 시리즈 필터링
      if (seriesFilter && post.series !== seriesFilter) {
        return false;
      }

      // 태그 필터링
      if (tagFilter && (!post.tags || !post.tags.includes(tagFilter))) {
        return false;
      }

      return true;
    },
    [searchQuery, categoryFilter, seriesFilter, tagFilter],
  );

  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter(filterPost);

    if (sortConfig.key && sortConfig.direction) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Post];
        const bValue = b[sortConfig.key as keyof Post];

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = aValue < bValue ? -1 : 1;

        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [posts, filterPost, sortConfig]);

  const getCategoryLabel = (category: string): string => {
    const isTech = () => category === 'tech';
    const isLife = () => category === 'life';
    const isReview = () => category === 'review';

    const categoryLabel = given({
      cases: [
        { when: isTech, then: '기술' },
        { when: isLife, then: '일상' },
        { when: isReview, then: '리뷰' },
      ],
      defaultValue: category,
    });

    return categoryLabel;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="제목이나 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 self-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                카테고리:{' '}
                {categoryFilter ? getCategoryLabel(categoryFilter) : '전체'}{' '}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                전체
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('tech')}>
                기술
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('life')}>
                일상
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter('review')}>
                리뷰
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {allSeries.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  시리즈: {seriesFilter || '전체'}{' '}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="max-h-48 overflow-y-auto"
              >
                <DropdownMenuItem onClick={() => setSeriesFilter(null)}>
                  전체
                </DropdownMenuItem>
                {allSeries.map((series) => (
                  <DropdownMenuItem
                    key={series.id}
                    onClick={() => setSeriesFilter(series.id)}
                  >
                    {series.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {allTags.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  태그: {tagFilter || '전체'}{' '}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="max-h-48 overflow-y-auto"
              >
                <DropdownMenuItem onClick={() => setTagFilter(null)}>
                  전체
                </DropdownMenuItem>
                {allTags.map((tag) => (
                  <DropdownMenuItem key={tag} onClick={() => setTagFilter(tag)}>
                    {tag}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="border border-foreground">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[45%]">
                <DataTableColumnHeader
                  title="제목"
                  onClick={() => handleSort('title')}
                  isSorted={sortConfig.key === 'title'}
                  sortDirection={
                    sortConfig.key === 'title' ? sortConfig.direction : null
                  }
                />
              </TableHead>
              <TableHead>
                <DataTableColumnHeader
                  title="카테고리"
                  onClick={() => handleSort('category')}
                  isSorted={sortConfig.key === 'category'}
                  sortDirection={
                    sortConfig.key === 'category' ? sortConfig.direction : null
                  }
                />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <DataTableColumnHeader
                  title="시리즈"
                  onClick={() => handleSort('series')}
                  isSorted={sortConfig.key === 'series'}
                  sortDirection={
                    sortConfig.key === 'series' ? sortConfig.direction : null
                  }
                />
              </TableHead>
              <TableHead className="hidden sm:table-cell w-36">
                <DataTableColumnHeader
                  title="태그"
                  className="justify-center"
                />
              </TableHead>
              <TableHead className="w-24">
                <DataTableColumnHeader
                  title="작성일"
                  onClick={() => handleSort('date')}
                  isSorted={sortConfig.key === 'date'}
                  sortDirection={
                    sortConfig.key === 'date' ? sortConfig.direction : null
                  }
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedPosts.length > 0 ? (
              filteredAndSortedPosts.map((post) => (
                <TableRow
                  key={`${post.category}/${post.slug}`}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    router.push(
                      `/blog/${post.category}/${post.koreanSlug || post.slug}`,
                    );
                  }}
                >
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{post.title}</div>
                      <div className="text-muted-foreground text-sm line-clamp-1">
                        {post.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readingTime}분 소요
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryLabel(post.category)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {post.series && post.seriesTitle ? (
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1.5" />
                        <span>{post.seriesTitle}</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-xs justify-center">
                      {post.tags && post.tags.length > 0
                        ? post.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTagFilter(tag);
                              }}
                            >
                              {tag}
                            </Badge>
                          ))
                        : '-'}
                      {post.tags && post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(post.date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  {searchQuery ||
                  categoryFilter ||
                  seriesFilter ||
                  tagFilter ? (
                    <div>
                      <p className="font-medium">검색 결과가 없습니다.</p>
                      <p className="text-muted-foreground text-sm mt-1">
                        다른 검색어를 입력하거나 필터를 조정해보세요.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">아직 작성된 글이 없습니다.</p>
                      <p className="text-muted-foreground text-sm mt-1">
                        첫 글을 작성해보세요!
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground text-right">
        총 {filteredAndSortedPosts.length}개 글{' '}
        {posts.length > filteredAndSortedPosts.length
          ? `(전체 ${posts.length}개 중)`
          : ''}
      </div>
    </div>
  );
};

export default BlogTable;
