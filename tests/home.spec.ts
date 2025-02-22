import { test, expect } from '@playwright/test';

test.describe('홈페이지 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 홈페이지로 이동
    await page.goto('/');
  });

  test('메인 페이지 레이아웃과 반응형 디자인', async ({ page }) => {
    // 데스크톱 뷰에서 테스트
    await expect(page.locator('main')).toHaveClass(/flex-col/);
    await expect(page.locator('main')).toHaveClass(/items-center/);

    // 모바일 뷰로 전환
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('main')).toHaveClass(/flex-col/);

    // 태블릿 뷰로 전환
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('main')).toHaveClass(/sm:items-start/);
  });

  test('이미지와 로고가 올바르게 로드됨', async ({ page }) => {
    // Next.js 로고 확인
    const nextLogo = page.getByAltText('Next.js logo');

    await expect(nextLogo).toBeVisible();

    // Vercel 로고 확인
    const vercelLogo = page.getByAltText('Vercel logomark');

    await expect(vercelLogo).toBeVisible();
  });

  test('Deploy 버튼 동작 확인', async ({ page, context }) => {
    // 새 페이지가 열리는 것을 기다림
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByText('Deploy now').click(),
    ]);

    // 새 페이지가 Vercel로 이동했는지 확인
    await expect(newPage).toHaveURL(/.*vercel.com\/new/);
  });

  test('코드 예제 표시 확인', async ({ page }) => {
    const codeElement = page.locator('code');

    await expect(codeElement).toContainText('app/page.tsx');
    await expect(codeElement).toHaveClass(/bg-black\/\[\.05\]/);
  });

  test('시각적 회귀 테스트', async ({ page }) => {
    // 데스크톱 뷰
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      maxDiffPixelRatio: 0.1,
    });

    // 모바일 뷰
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      maxDiffPixelRatio: 0.1,
    });
  });

  test('성능 메트릭 테스트', async ({ page }) => {
    const performanceTimings = await page.evaluate(() => ({
      // First Contentful Paint
      fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      // Largest Contentful Paint
      lcp: performance.getEntriesByName('largest-contentful-paint')[0]
        ?.startTime,
      // Time to Interactive (근사치)
      tti:
        performance.timing.domInteractive - performance.timing.navigationStart,
    }));

    // 성능 기준 검증
    expect(performanceTimings.fcp).toBeLessThan(2000); // 2초 이내
    expect(performanceTimings.lcp).toBeLessThan(2500); // 2.5초 이내
    expect(performanceTimings.tti).toBeLessThan(3500); // 3.5초 이내
  });

  test('느린 네트워크 환경 테스트', async ({ page, context }) => {
    // 3G 네트워크 시뮬레이션
    await context.route('**/*', async (route) => {
      await route.continue({
        delay: 100,
        throttling: {
          downloadSpeed: (750 * 1024) / 8, // 750kb/s
          uploadSpeed: (250 * 1024) / 8, // 250kb/s
          latency: 100, // 100ms RTT
        },
      });
    });

    // 페이지 로드 시작 시간 기록
    const startTime = Date.now();

    // 페이지 로드
    await page.goto('/', { waitUntil: 'networkidle' });

    // 로딩 완료 시간 계산
    const loadTime = Date.now() - startTime;

    // 느린 네트워크에서도 5초 이내 로드
    expect(loadTime).toBeLessThan(5000);

    // 주요 컨텐츠가 모두 표시되는지 확인
    await expect(page.getByAltText('Next.js logo')).toBeVisible();
    await expect(page.getByText('Deploy now')).toBeVisible();
  });

  test('오프라인 상태 대응 테스트', async ({ page, context }) => {
    // 오프라인 모드 시뮬레이션
    await context.setOffline(true);

    // 페이지 새로고침
    await page.reload();

    // 오프라인 상태 메시지나 폴백 UI가 표시되는지 확인
    await expect(
      page.getByText(/offline|연결 끊김|네트워크 오류/i),
    ).toBeVisible();

    // 온라인 상태로 복구
    await context.setOffline(false);
  });
});
