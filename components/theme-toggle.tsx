'use client';

import type { JSX } from 'react';

import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';

import given from '@internal/lib/given';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle(): JSX.Element {
  const { theme, setTheme } = useTheme();

  const themeAccent = given({
    cases: [
      {
        when: !!theme,
        then: 'bg-accent',
      },
    ],
    defaultValue: '',
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">테마 변경</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={themeAccent}
        >
          <Sun className="mr-2 h-4 w-4" />
          라이트
          {theme === 'light' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={themeAccent}
        >
          <Moon className="mr-2 h-4 w-4" />
          다크
          {theme === 'dark' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={themeAccent}
        >
          <Monitor className="mr-2 h-4 w-4" />
          시스템
          {theme === 'system' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
