'use client';

import type { ReactNode } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import type { TableData } from '@internal/components/table-view/schema';

import { Clock, BookOpen } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { categories } from './data';
import { DataTableRowActions } from './data-table-row-actions';
import { DataTableColumnHeader } from './data-table-column-header';

export const columns: ColumnDef<TableData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="모두 선택"
        className="translate-y-[2px] border border-foreground"
      />
    ),
    cell: ({ row }): ReactNode => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
        className="translate-y-[2px] border border-foreground"
        onClick={(e) => e.stopPropagation()} // 상위 이벤트 전파 방지
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader
        title="제목"
        onClick={() => column.toggleSorting()}
        isSorted={column.getIsSorted() !== false}
        sortDirection={column.getIsSorted() || null}
      />
    ),
    cell: ({ row }): ReactNode => {
      return (
        <div className="flex flex-col">
          <div className="font-medium">{row.getValue('title')}</div>
          {row.original.description && (
            <div className="text-sm text-muted-foreground line-clamp-1">
              {row.original.description}
            </div>
          )}
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {row.original.readingTime ?? 5}분 소요
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader
        title="카테고리"
        onClick={() => column.toggleSorting()}
        isSorted={column.getIsSorted() !== false}
        sortDirection={column.getIsSorted() || null}
      />
    ),
    cell: ({ row }): ReactNode => {
      const category = categories.find(
        (cat) => cat.value === row.getValue('category'),
      );

      const label = category?.label || row.getValue('category');

      return (
        <div className="flex items-center">
          {category?.icon && (
            <category.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{label}</span>
        </div>
      );
    },
    filterFn: (row, id, value): boolean => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'series',
    header: ({ column }) => (
      <DataTableColumnHeader
        title="시리즈"
        onClick={() => column.toggleSorting()}
        isSorted={column.getIsSorted() !== false}
        sortDirection={column.getIsSorted() || null}
      />
    ),
    cell: ({ row }): ReactNode => {
      const series = row.getValue('series');
      const seriesTitle = row.original.seriesTitle;

      return (
        <div className="flex items-center">
          {series ? (
            <>
              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{seriesTitle || String(series)}</span>
            </>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    },
    filterFn: (row, id, value): boolean => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'tags',
    header: ({ column }) => (
      <DataTableColumnHeader
        title="태그"
        onClick={() => column.toggleSorting()}
        isSorted={column.getIsSorted() !== false}
        sortDirection={column.getIsSorted() || null}
      />
    ),
    cell: ({ row }): ReactNode => {
      const tags = row.getValue('tags') as string[] | undefined;

      return (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {tags && tags.length > 0 ? (
            <>
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 2}
                </Badge>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    },
    filterFn: (row, id, value): boolean => {
      const rowValue = row.getValue(id) as string[] | undefined;

      if (!rowValue) return false;

      return rowValue.some((tag) => value.includes(tag));
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader
        title="작성일"
        onClick={() => column.toggleSorting()}
        isSorted={column.getIsSorted() !== false}
        sortDirection={column.getIsSorted() || null}
      />
    ),
    cell: ({ row }): ReactNode => (
      <span>
        {new Date(row.getValue('date')).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </span>
    ),
  },
  {
    accessorKey: 'readingTime',
    header: ({ column }) => (
      <DataTableColumnHeader
        title="읽기 시간"
        onClick={() => column.toggleSorting()}
        isSorted={column.getIsSorted() !== false}
        sortDirection={column.getIsSorted() || null}
      />
    ),
    cell: ({ row }): ReactNode => {
      const readingTime = row.getValue('readingTime');

      return (
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{readingTime ? `${readingTime}분` : '5분'}</span>
        </div>
      );
    },
    filterFn: (row, id, value): boolean => {
      const readingTime = row.getValue(id) as number | undefined;

      if (!readingTime) return false;

      // 읽기 시간 필터링 로직
      return value.some((filter: string) => {
        if (filter === 'short') return readingTime <= 5;
        if (filter === 'medium') return readingTime > 5 && readingTime <= 10;
        if (filter === 'long') return readingTime > 10;

        return false;
      });
    },
  },
  {
    id: 'actions',
    cell: ({ row }): ReactNode => (
      <div onClick={(e) => e.stopPropagation()}>
        <DataTableRowActions row={row} />
      </div>
    ),
  },
];
