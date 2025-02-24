import type { JSX, ReactNode } from 'react';

import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { cn } from '@internal/lib/utils';
import { Button } from '@/components/ui/button';

interface DataTableColumnHeaderProps {
  title: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  isSorted?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
}

export function DataTableColumnHeader({
  title,
  className,
  children,
  onClick,
  isSorted,
  sortDirection,
}: DataTableColumnHeaderProps): JSX.Element {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={onClick}
      >
        <span>{title}</span>
        {isSorted && (
          <>
            {sortDirection === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : sortDirection === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            )}
          </>
        )}
      </Button>
      {children}
    </div>
  );
}
