'use client';

import type { ComponentProps, JSX } from 'react';

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

function AspectRatio({
  ...props
}: ComponentProps<typeof AspectRatioPrimitive.Root>): JSX.Element {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
