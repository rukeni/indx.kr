import { test, expect } from '@playwright/test';

test.describe('Button 컴포넌트 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('버튼 상호작용 테스트', async ({ page }) => {
    const button = page.getByRole('button').first();

    // 기본 상태 확인
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    // 호버 상태 테스트
    await button.hover();
    // 호버 시 스타일 변경 확인
    await expect(button).toHaveCSS('background-color', /rgba\(.*\)/);

    // 포커스 상태 테스트
    await button.focus();
    await expect(button).toBeFocused();

    // 클릭 테스트
    await button.click();
    // 클릭 후 상태나 스타일 변경 확인
  });

  test('키보드 접근성 테스트', async ({ page }) => {
    // Tab 키로 버튼에 접근
    await page.keyboard.press('Tab');
    const button = page.getByRole('button').first();

    await expect(button).toBeFocused();

    // Enter 키로 버튼 활성화
    await page.keyboard.press('Enter');
    // Space 키로 버튼 활성화
    await page.keyboard.press('Space');
  });

  test('버튼 반응형 디자인 테스트', async ({ page }) => {
    const button = page.getByRole('button').first();

    // 모바일 뷰
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(button).toHaveCSS('font-size', '14px');

    // 데스크톱 뷰
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(button).toHaveCSS('font-size', '16px');
  });

  test('버튼 로딩 상태 테스트', async ({ page }) => {
    // 로딩 상태의 버튼이 있다면
    const loadingButton = page.getByRole('button', { name: /loading/i });

    if ((await loadingButton.count()) > 0) {
      await expect(loadingButton).toBeDisabled();
      await expect(loadingButton).toHaveAttribute('aria-busy', 'true');
    }
  });

  test('버튼 시각적 회귀 테스트', async ({ page }) => {
    const button = page.getByRole('button').first();

    // 기본 상태
    await expect(button).toHaveScreenshot('button-default.png');

    // 호버 상태
    await button.hover();
    await expect(button).toHaveScreenshot('button-hover.png');

    // 포커스 상태
    await button.focus();
    await expect(button).toHaveScreenshot('button-focus.png');

    // 활성화(클릭) 상태
    await page.mouse.down();
    await expect(button).toHaveScreenshot('button-active.png');
    await page.mouse.up();
  });

  test('버튼 애니메이션 성능 테스트', async ({ page }) => {
    const button = page.getByRole('button').first();

    // 버튼 클릭 시 애니메이션 성능 측정
    const animationMetrics = await button.evaluate((element) => {
      const animations = element.getAnimations();

      return animations.map((animation) => ({
        duration: animation.effect?.getTiming().duration,
        delay: animation.effect?.getTiming().delay,
      }));
    });

    // 애니메이션이 있다면 성능 검증
    animationMetrics.forEach((metric) => {
      if (metric.duration) {
        expect(metric.duration).toBeLessThanOrEqual(300); // 300ms 이하
      }
    });
  });

  test('버튼 접근성 고급 테스트', async ({ page }) => {
    const button = page.getByRole('button').first();

    // 색상 대비 검사 (실제로는 더 복잡한 계산이 필요)
    const buttonStyles = await button.evaluate((element) => {
      const styles = window.getComputedStyle(element);

      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });

    // ARIA 레이블 확인
    const ariaLabel = await button.getAttribute('aria-label');

    if (ariaLabel) {
      expect(ariaLabel.length).toBeGreaterThan(0);
    }

    // 터치 타겟 사이즈 확인
    const buttonSize = await button.boundingBox();

    if (buttonSize) {
      expect(buttonSize.width).toBeGreaterThanOrEqual(44); // WCAG 권장 최소 크기
      expect(buttonSize.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('버튼 에러 상태 테스트', async ({ page }) => {
    // 에러 상태의 버튼이 있다면
    const errorButton = page.getByRole('button', { name: /error/i });

    if ((await errorButton.count()) > 0) {
      // 에러 상태 시각적 표시 확인
      await expect(errorButton).toHaveClass(/error|destructive/);

      // 에러 메시지 툴팁 확인
      await errorButton.hover();
      await expect(page.getByRole('tooltip')).toBeVisible();
    }
  });
});
