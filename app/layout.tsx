import type { JSX } from 'react';
import type { Metadata } from 'next';

import Link from 'next/link';
import { Inter } from 'next/font/google';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ThemeProvider } from '@/components/theme-provider';
import OfflineDetector from '@/components/offline-detector';
import { MainNavigation } from '@internal/components/navigation/main-navigation';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'indx.kr',
  description: 'A blog about technology, life, and everything in between.',
  keywords: ['blog', 'technology', 'programming', 'life', 'development', 'web'],
  authors: [{ name: 'indx.kr', url: 'https://indx.kr' }],
  creator: 'indx.kr',
  publisher: 'indx.kr',
  alternates: {
    types: {
      'application/rss+xml': '/api/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://indx.kr',
    title: 'indx.kr',
    description: 'A blog about technology, life, and everything in between.',
    siteName: 'indx.kr',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'indx.kr',
    description: 'A blog about technology, life, and everything in between.',
    creator: '@indx_kr',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed for indx.kr"
          href="/api/feed.xml"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="grid min-h-screen grid-rows-[auto,1fr,auto]">
            <header className="sticky top-0 z-50 w-full border-b border-b-foreground bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 justify-between items-center">
                <Link href="/">
                  <div className="flex items-center justify-center gap-2 mx-4">
                    <span className="text-xl font-bold">indx.kr</span>
                  </div>
                </Link>
                <MainNavigation />
                <div className="flex justify-center gap-4 mx-4">
                  <a
                    href="/api/feed.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    RSS
                  </a>
                  <a
                    href="https://github.com/rukeni/indx.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
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
            <footer className="border-t border-t-foreground py-6 md:py-0 flex flex-col justify-center items-center">
              <div className="flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row mx-4">
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
          <OfflineDetector />
        </ThemeProvider>
      </body>
    </html>
  );
}
