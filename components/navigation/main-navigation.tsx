'use client';

import type { JSX } from 'react';

import Link from 'next/link';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';

export function MainNavigation(): JSX.Element {
  return (
    <Menubar className="px-2 lg:px-4">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">블로그</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/blog" className="flex w-full">
              전체 글<MenubarShortcut>⌘B</MenubarShortcut>
            </Link>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Link href="/blog/tech" className="flex w-full">
              기술
            </Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/blog/review" className="flex w-full">
              리뷰
            </Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/blog/life" className="flex w-full">
              일상
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="relative">프로젝트</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/projects" className="flex w-full">
              전체 프로젝트
              <MenubarShortcut>⌘P</MenubarShortcut>
            </Link>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            <Link href="/projects/web" className="flex w-full">
              웹
            </Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/projects/app" className="flex w-full">
              앱
            </Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/projects/library" className="flex w-full">
              라이브러리
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>소개</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href="/about" className="flex w-full">
              About
              <MenubarShortcut>⌘A</MenubarShortcut>
            </Link>
          </MenubarItem>
          <MenubarItem>
            <Link href="/contact" className="flex w-full">
              Contact
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
