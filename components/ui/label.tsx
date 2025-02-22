'use client';

import { type ComponentProps, type JSX } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

import { cn } from '@internal/lib/utils';

function Label({
  className,
  ...props
}: ComponentProps<typeof LabelPrimitive.Root>): JSX.Element {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Label };
