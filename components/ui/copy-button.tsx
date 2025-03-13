'use client';

import { useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);

    // 2초 후에 상태 초기화
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        'absolute right-3 top-3 rounded-md p-2 transition-all',
        'bg-muted/30 hover:bg-muted/50',
        'focus:outline-none focus:ring-2 focus:ring-primary',
        className,
      )}
      aria-label={isCopied ? '복사됨' : '코드 복사'}
    >
      {isCopied ? (
        <CheckIcon className="h-4 w-4 text-green-500" />
      ) : (
        <CopyIcon className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
  );
}
