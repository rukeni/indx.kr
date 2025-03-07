'use client';

import type { JSX } from 'react';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { RefreshCw } from 'lucide-react';
import { useState, useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { type Theme } from '@/lib/theme-config';
import { createThemeConfig } from '@/lib/create-theme';
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
  const [isChanging, setIsChanging] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  // 현재 테마 모드(light/dark)를 확인
  const getCurrentThemeMode = useCallback(() => {
    return resolvedTheme === 'dark' ? 'dark' : 'light';
  }, [resolvedTheme]);

  const generateNewTheme = useCallback(() => {
    // 이미 변경 중이면 중복 실행 방지
    if (isChanging) return;

    setIsChanging(true);

    const newTheme = createThemeConfig();

    // 테마 설정을 로컬 스토리지에 저장
    // localStorage.setItem('custom-theme', JSON.stringify(newTheme));

    // 현재 테마 모드에 맞는 테마 객체를 CSS 변수로 적용
    const themeMode = getCurrentThemeMode() as 'light' | 'dark';

    applyThemeToCssVariables(newTheme[themeMode]);

    // 테마 적용
    setTheme('custom');

    // console.log(`새 테마가 생성되었습니다. 모드: ${themeMode}`);

    // 변경 완료 후 상태 업데이트 (애니메이션 시간 고려)
    setTimeout(() => {
      setIsChanging(false);
    }, 160); // CSS 트랜지션 시간보다 약간 더 길게 설정
  }, [setTheme, getCurrentThemeMode, isChanging]);

  // 테마 객체를 CSS 변수로 변환하여 적용하는 함수
  const applyThemeToCssVariables = useCallback(
    (theme: Theme) => {
      if (!theme) {
        console.error('테마 객체가 유효하지 않습니다:', theme);

        return;
      }

      const root = document.documentElement;

      // 기본 색상 변수 적용
      applyCssColorVariable(root, '--background', theme.background);
      applyCssColorVariable(root, '--foreground', theme.foreground);

      // 카드 색상 변수 적용
      applyCssColorVariable(root, '--card', theme.card);
      applyCssColorVariable(root, '--card-foreground', theme.cardForeground);

      // 팝오버 색상 변수 적용
      applyCssColorVariable(root, '--popover', theme.popover);
      applyCssColorVariable(
        root,
        '--popover-foreground',
        theme.popoverForeground,
      );

      // 프라이머리 색상 변수 적용
      applyCssColorVariable(root, '--primary', theme.primary);
      applyCssColorVariable(
        root,
        '--primary-foreground',
        theme.primaryForeground,
      );

      // 세컨더리 색상 변수 적용
      applyCssColorVariable(root, '--secondary', theme.secondary);
      applyCssColorVariable(
        root,
        '--secondary-foreground',
        theme.secondaryForeground,
      );

      // 머트 색상 변수 적용
      applyCssColorVariable(root, '--muted', theme.muted);
      applyCssColorVariable(root, '--muted-foreground', theme.mutedForeground);

      // 액센트 색상 변수 적용
      applyCssColorVariable(root, '--accent', theme.accent);
      applyCssColorVariable(
        root,
        '--accent-foreground',
        theme.accentForeground,
      );

      // 디스트럭티브 색상 변수 적용
      applyCssColorVariable(root, '--destructive', theme.destructive);
      applyCssColorVariable(
        root,
        '--destructive-foreground',
        theme.destructiveForeground,
      );

      // 보더 색상 변수 적용
      applyCssColorVariable(root, '--border', theme.border);

      // 인풋 색상 변수 적용
      applyCssColorVariable(root, '--input', theme.input);

      // 링 색상 변수 적용
      applyCssColorVariable(root, '--ring', theme.ring);

      // 차트 색상 변수 적용 (있는 경우)
      Object.entries(theme).forEach(([key, value]) => {
        if (key.startsWith('chart-') && value) {
          applyCssColorVariable(root, `--${key}`, value);
        }
      });

      // 직접 body와 html 요소에 배경색 적용
      applyDirectBackgroundColor(theme.background, getCurrentThemeMode());

      console.log('테마가 성공적으로 적용되었습니다:', theme);
    },
    [getCurrentThemeMode],
  );

  // 직접 배경색을 적용하는 함수
  const applyDirectBackgroundColor = (
    background: { h: number; s: number; l: number },
    mode: string,
  ) => {
    if (!background) return;

    const html = document.documentElement;
    const body = document.body;

    // HSL 값을 CSS 색상 문자열로 변환
    const bgColor = `hsl(${background.h} ${background.s}% ${background.l}%)`;

    // HTML과 body 요소에 직접 배경색 적용
    html.style.backgroundColor = bgColor;
    body.style.backgroundColor = bgColor;

    // 테마 클래스 적용
    html.classList.remove('light', 'dark');
    html.classList.add(mode);

    // data-theme 속성 설정 (일부 UI 라이브러리에서 사용)
    html.setAttribute('data-theme', 'custom');
  };

  // HSL 객체를 CSS 변수로 변환하여 적용하는 함수
  const applyCssColorVariable = (
    root: HTMLElement,
    variableName: string,
    hsl: { h: number; s: number; l: number },
  ) => {
    if (!hsl) return;

    // HSL 값을 CSS 변수로 설정
    root.style.setProperty(
      `${variableName}`,
      `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`,
    );

    // 일부 변수는 opacity 변형도 필요함
    if (
      variableName.includes('background') ||
      variableName.includes('foreground') ||
      variableName.includes('primary') ||
      variableName.includes('secondary') ||
      variableName.includes('accent') ||
      variableName.includes('destructive')
    ) {
      root.style.setProperty(
        `${variableName}/80`,
        `hsl(${hsl.h} ${hsl.s}% ${hsl.l}% / 0.8)`,
      );
      root.style.setProperty(
        `${variableName}/50`,
        `hsl(${hsl.h} ${hsl.s}% ${hsl.l}% / 0.5)`,
      );
      root.style.setProperty(
        `${variableName}/30`,
        `hsl(${hsl.h} ${hsl.s}% ${hsl.l}% / 0.3)`,
      );
      root.style.setProperty(
        `${variableName}/10`,
        `hsl(${hsl.h} ${hsl.s}% ${hsl.l}% / 0.1)`,
      );
    }
  };

  // 테마 모드가 변경될 때 테마를 다시 적용
  // useEffect(() => {
  //   const storedTheme = localStorage.getItem('custom-theme');

  //   if (storedTheme) {
  //     try {
  //       const parsedTheme = JSON.parse(storedTheme);
  //       const themeMode = getCurrentThemeMode();

  //       applyThemeToCssVariables(parsedTheme[themeMode]);
  //     } catch (error) {
  //       console.error('저장된 테마를 파싱하는 중 오류가 발생했습니다:', error);
  //     }
  //   }
  // }, [resolvedTheme, applyThemeToCssVariables, getCurrentThemeMode]);

  return (
    <Menubar className="px-2 lg:px-4 border border-foreground rounded-none">
      <Button
        variant="ghost"
        size="icon"
        onClick={generateNewTheme}
        className="mr-2 hover:bg-transparent active:bg-transparent"
        title="새로운 테마로 변경"
        disabled={isChanging}
      >
        <RefreshCw
          className={`h-4 w-4 text-primary ${isChanging ? 'animate-spin' : ''}`}
        />
      </Button>

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
            <a
              href="https://github.com/rukeni"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full"
            >
              About
              {/* <MenubarShortcut>⌘A</MenubarShortcut> */}
            </a>
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
