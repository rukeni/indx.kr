'use client';

import type { JSX } from 'react';
import type { Table } from '@tanstack/react-table';

import type { Post } from '@internal/lib/blog';

import { X } from 'lucide-react';
import { useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, Tag, Clock, FolderOpen } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

interface FilterOption {
  label: string;
  value: string;
  icon: typeof BookOpen | typeof Tag | typeof Clock | typeof FolderOpen;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFiltered = table.getState().columnFilters.length > 0;

  // 실제 데이터에서 필터 옵션 생성
  const filterOptions = useMemo(() => {
    const data = table
      .getCoreRowModel()
      .rows.map((row) => row.original) as Post[];

    // 카테고리 옵션
    const categories: FilterOption[] = Array.from(
      new Set(data.map((item) => item.category)),
    ).map((category) => ({
      label: category,
      value: category,
      icon: FolderOpen,
    }));

    // 시리즈 옵션
    const seriesMap = new Map<string, string>();

    data.forEach((item) => {
      if (item.series) {
        if (item.seriesTitle) {
          seriesMap.set(item.series, item.seriesTitle);
        }
      }
    });

    const series: FilterOption[] = Array.from(seriesMap.entries()).map(
      ([id, title]) => {
        return {
          label: title,
          value: id,
          icon: BookOpen,
        };
      },
    );

    // 태그 옵션
    const tags: FilterOption[] = Array.from(
      new Set(data.flatMap((item) => item.tags || [])),
    ).map((tag) => ({
      label: tag,
      value: tag,
      icon: Tag,
    }));

    // 읽기 시간 옵션
    const readingTimes: FilterOption[] = Array.from(
      new Set(
        data
          .filter((item) => item.readingTime)
          .map((item) => Math.floor((item.readingTime || 0) / 5) * 5),
      ),
    )
      .sort((a, b) => a - b)
      .map((time) => ({
        label: `${time}-${time + 4}분`,
        value: time.toString(),
        icon: Clock,
      }));

    return {
      categories,
      series,
      tags,
      readingTimes,
    };
  }, [table]);

  // URL 파라미터를 테이블 필터에 적용하는 함수
  const applyUrlParamsToFilter = useCallback(
    (params: URLSearchParams, table: Table<TData>) => {
      const title = params.get('title');
      const category = params.get('category');
      const series = params.get('series');
      const tags = params.get('tags');
      const readingTime = params.get('readingTime');

      if (title) {
        table.getColumn('title')?.setFilterValue(title);
      }
      if (category) {
        table.getColumn('category')?.setFilterValue([category]);
      }
      if (series) {
        table.getColumn('series')?.setFilterValue([series]);
      }
      if (tags) {
        table.getColumn('tags')?.setFilterValue(tags.split(','));
      }
      if (readingTime) {
        table.getColumn('readingTime')?.setFilterValue([readingTime]);
      }
    },
    [],
  );

  // URL 파라미터를 테이블 필터에 적용
  useEffect(() => {
    applyUrlParamsToFilter(searchParams, table);
  }, [searchParams, table, applyUrlParamsToFilter]);

  // 필터 변경을 URL에 반영
  const updateURL = useCallback(
    (columnId: string, value: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.length) {
        params.set(columnId, value.join(','));
      } else {
        params.delete(columnId);
      }

      // 빈 필터는 URL에서 제거
      if (!Array.from(params.values()).some(Boolean)) {
        router.push('/', { scroll: false });
      } else {
        router.push(`/?${params.toString()}`, { scroll: false });
      }
    },
    [router, searchParams],
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="제목 검색..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            const value = event.target.value;

            table.getColumn('title')?.setFilterValue(value);
            const params = new URLSearchParams(searchParams.toString());

            if (value) {
              params.set('title', value);
            } else {
              params.delete('title');
            }
            router.push(params.toString() ? `/?${params.toString()}` : '/', {
              scroll: false,
            });
          }}
          className="h-8 w-[150px] lg:w-[250px] border border-foreground"
        />
        {table.getColumn('category') && (
          <DataTableFacetedFilter
            column={table.getColumn('category')}
            title="카테고리"
            options={filterOptions.categories}
            onValueChange={(value) => updateURL('category', value)}
          />
        )}
        {table.getColumn('series') && (
          <DataTableFacetedFilter
            column={table.getColumn('series')}
            title="시리즈"
            options={filterOptions.series}
            onValueChange={(value) => updateURL('series', value)}
          />
        )}
        {table.getColumn('tags') && (
          <DataTableFacetedFilter
            column={table.getColumn('tags')}
            title="태그"
            options={filterOptions.tags}
            onValueChange={(value) => updateURL('tags', value)}
          />
        )}
        {table.getColumn('readingTime') && (
          <DataTableFacetedFilter
            column={table.getColumn('readingTime')}
            title="읽기 시간"
            options={filterOptions.readingTimes}
            onValueChange={(value) => updateURL('readingTime', value)}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              router.push('/', { scroll: false });
            }}
            className="h-8 px-2 lg:px-3"
          >
            초기화
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
