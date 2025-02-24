'use client';

import type { JSX } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import type { TableData } from '@internal/components/table-view/schema';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { labels, priorities, statuses } from './data';
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
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="행 선택"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader
        title="할 일"
        onClick={() => column.toggleSorting()}
        isSorted={column.getIsSorted() !== false}
        sortDirection={column.getIsSorted() || null}
      />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
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
    cell: ({ row }): JSX.Element => {
      const label = labels.find((label) => label.value === row.original.label);
      const status = statuses.find(
        (status) => status.value === row.getValue('status'),
      );

      return (
        <div className="flex flex-col gap-1">
          <Link
            href={`/blog/tech/${row.original.id.toLowerCase()}`}
            className="font-medium hover:underline"
          >
            {row.getValue('title')}
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {label && <Badge variant="outline">{label.label}</Badge>}
            {status && status.icon && (
              <div className="flex items-center gap-1">
                <status.icon className="h-3 w-3" />
                <span>{status.label}</span>
              </div>
            )}
            {row.original.date && (
              <span className="text-muted-foreground">{row.original.date}</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        title="상태"
        onClick={() => column.toggleSorting()}
        isSorted={column.getIsSorted() !== false}
        sortDirection={column.getIsSorted() || null}
      />
    ),
    cell: ({ row }): JSX.Element | null => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status'),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value): boolean => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <DataTableColumnHeader
        title="우선순위"
        onClick={() => column.toggleSorting()}
        isSorted={column.getIsSorted() !== false}
        sortDirection={column.getIsSorted() || null}
      />
    ),
    cell: ({ row }): JSX.Element | null => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue('priority'),
      );

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value): boolean => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'label',
    header: ({ column }) => (
      <DataTableColumnHeader
        title="카테고리"
        onClick={() => column.toggleSorting()}
        isSorted={column.getIsSorted() !== false}
        sortDirection={column.getIsSorted() || null}
      />
    ),
    cell: ({ row }): JSX.Element | null => {
      const label = labels.find(
        (label) => label.value === row.getValue('label'),
      );

      if (!label) {
        return null;
      }

      return (
        <div className="flex items-center">
          <Badge variant="outline">{label.label}</Badge>
        </div>
      );
    },
    filterFn: (row, id, value): boolean => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }): JSX.Element => <DataTableRowActions row={row} />,
  },
];
