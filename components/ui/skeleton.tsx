import { type ComponentProps, type JSX } from 'react';

import { cn } from '@internal/lib/utils';

function Skeleton({ className, ...props }: ComponentProps<'div'>): JSX.Element {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-primary/10 animate-pulse rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
