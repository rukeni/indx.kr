'use client';

import type { JSX } from 'react';

import type { Post } from '@internal/lib/blog';

import { useMemo } from 'react';
import { useState, type FC } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: null,
  });

  const handleSort = (key: keyof Post): void => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter((post) => {
      if (statusFilter && post.status !== statusFilter) return false;
      if (categoryFilter && post.category !== categoryFilter) return false;
      if (priorityFilter && post.priority !== priorityFilter) return false;

      return true;
    });

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
  }, [posts, statusFilter, categoryFilter, priorityFilter, sortConfig]);

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'backlog':
        return '연재 예정';

      case 'todo':
        return '작성 예정';

      case 'in progress':
        return '작성 중';

      case 'done':
        return '발행됨';

      case 'canceled':
        return '비공개';

      default:
        return '작성 중';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
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
              <div className="flex items-center gap-2">
                <DataTableColumnHeader
                  title="상태"
                  onClick={() => handleSort('status')}
                  isSorted={sortConfig.key === 'status'}
                  sortDirection={
                    sortConfig.key === 'status' ? sortConfig.direction : null
                  }
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2 h-8">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">상태 필터</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                      전체
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('backlog')}
                    >
                      연재 예정
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('todo')}>
                      작성 예정
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('in progress')}
                    >
                      작성 중
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('done')}>
                      완료
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setStatusFilter('canceled')}
                    >
                      비공개
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <DataTableColumnHeader
                  title="카테고리"
                  onClick={() => handleSort('category')}
                  isSorted={sortConfig.key === 'category'}
                  sortDirection={
                    sortConfig.key === 'category' ? sortConfig.direction : null
                  }
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2 h-8">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">카테고리 필터</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                      전체
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter('tech')}>
                      기술
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCategoryFilter('life')}>
                      일상
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setCategoryFilter('review')}
                    >
                      리뷰
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <DataTableColumnHeader
                  title="우선순위"
                  onClick={() => handleSort('priority')}
                  isSorted={sortConfig.key === 'priority'}
                  sortDirection={
                    sortConfig.key === 'priority' ? sortConfig.direction : null
                  }
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2 h-8">
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">우선순위 필터</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                      전체
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter('high')}>
                      높음
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setPriorityFilter('medium')}
                    >
                      중간
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPriorityFilter('low')}>
                      낮음
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
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
                  router.push(`/blog/${post.category}/${post.slug}`);
                }}
              >
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  {getStatusLabel(post.status || 'in progress')}
                </TableCell>
                <TableCell className="capitalize">{post.category}</TableCell>
                <TableCell>{post.priority || '중간'}</TableCell>
                <TableCell>
                  {new Date(post.date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                검색 결과가 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BlogTable;
