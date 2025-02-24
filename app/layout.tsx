import type { JSX } from 'react';
import type { Metadata } from 'next';

import Link from 'next/link';
import { Inter } from 'next/font/google';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import { MainNavigation } from '@internal/components/navigation/main-navigation';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'indx.kr',
  description: 'A blog about technology, life, and everything in between.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 justify-between items-center">
                <Link href="/">
                  <div className="flex items-center justify-center gap-2 mx-4">
                    <span className="text-xl font-bold">indx.kr</span>
                  </div>
                </Link>
                <MainNavigation />
                <div className="flex justify-center gap-4 mx-4">
                  <a
                    href="https://github.com/rukeni/indx.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    GitHub
                  </a>
                </div>
                <div className="ml-auto flex items-center gap-2 mx-4">
                  <ThemeToggle />
                </div>
              </div>
            </header>
            {children}
            <footer className="border-t py-6 md:py-0">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-sm text-muted-foreground">
                  © 2025 indx.kr. All rights reserved.
                </p>
                <div className="flex gap-4">
                  <Button variant="ghost" size="sm">
                    Terms
                  </Button>
                  <Button variant="ghost" size="sm">
                    Privacy
                  </Button>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
