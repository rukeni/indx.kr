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

  test('시각적 회귀 테스트', async ({ page }) => {
    // 데스크톱 뷰
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      maxDiffPixelRatio: 0.15,
    });

    // 모바일 뷰
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      maxDiffPixelRatio: 0.15,
    });
  });

  test('성능 메트릭 테스트', async ({ page }) => {
    // 페이지 로드 시작
    await page.goto('/', { waitUntil: 'networkidle' });

    const performanceTimings = await page.evaluate(() => {
      const entries = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(
        (entry) => entry.name === 'first-contentful-paint',
      );

      return {
        fcp: fcpEntry?.startTime || 0,
        lcp: entries.loadEventEnd - entries.startTime,
        tti: entries.domInteractive - entries.startTime,
      };
    });

    // 성능 기준 검증 (개발 환경 기준으로 조정)
    expect(performanceTimings.fcp).toBeLessThan(5000); // 5초 이내
    expect(performanceTimings.lcp).toBeLessThan(6000); // 6초 이내
    expect(performanceTimings.tti).toBeLessThan(6000); // 6초 이내
  });

  test('오프라인 상태 대응 테스트', async ({ page, context }) => {
    // 먼저 페이지 로드
    await page.goto('/', { waitUntil: 'networkidle' });

    // 오프라인 모드 시뮬레이션
    await context.setOffline(true);

    // JavaScript를 통해 오프라인 이벤트 트리거
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'));
    });

    // 오프라인 상태 메시지가 표시되는지 확인
    const offlineMessage = page.locator('#offline-message');

    await expect(offlineMessage).not.toHaveClass('hidden');

    // 온라인 상태로 복구
    await context.setOffline(false);
    await page.evaluate(() => {
      window.dispatchEvent(new Event('online'));
    });

    // 메시지가 다시 숨겨지는지 확인
    await expect(offlineMessage).toHaveClass('hidden');
  });
});
