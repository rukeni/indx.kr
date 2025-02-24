import { test, expect } from '@playwright/test';

test.describe('블로그 기능', () => {
  test('메인 페이지에서 블로그 포스트 목록을 테이블 형식으로 볼 수 있다', async ({
    page,
  }) => {
    await page.goto('/');

    // 테이블이 존재하는지 확인
    const table = await page.getByRole('table');

    await expect(table).toBeVisible();

    // 테이블 헤더 확인
    const headers = await page
      .getByRole('button', { name: /제목|상태|카테고리|우선순위|작성일/ })
      .all();
    const headerTexts = await Promise.all(
      headers.map((header) => header.textContent()),
    );

    expect(headerTexts).toContain('제목');
    expect(headerTexts).toContain('상태');
    expect(headerTexts).toContain('카테고리');
    expect(headerTexts).toContain('우선순위');

    // 테이블 데이터 확인
    const rows = await page.getByRole('row').all();

    expect(rows.length).toBeGreaterThan(1); // 헤더 포함하여 최소 1개 이상의 행
  });

  test('블로그 포스트를 클릭하면 상세 페이지로 이동한다', async ({ page }) => {
    await page.goto('/');

    // 테이블이 로드될 때까지 기다림
    const table = page.getByRole('table');

    await expect(table).toBeVisible();

    // 첫 번째 행이 로드될 때까지 기다림
    const firstRow = page.locator('tbody tr').first();

    await expect(firstRow).toBeVisible();

    // 링크를 찾아서 클릭
    const firstLink = firstRow.getByRole('link').first();

    await expect(firstLink).toBeVisible();

    // 링크 텍스트 저장
    const linkText = await firstLink.textContent();

    expect(linkText).toBeTruthy();

    // 링크의 href 속성 가져오기
    const href = await firstLink.getAttribute('href');

    expect(href).toBeTruthy();
    expect(href).toMatch(/\/blog\/.*/);

    // 링크 클릭 및 네비게이션 대기
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      firstLink.click(),
    ]);

    // URL 확인
    const currentUrl = page.url();

    expect(currentUrl).toMatch(/\/blog\/.*/);

    // 제목 확인 (header 내부의 h1 태그를 찾음)
    const heading = page.locator('header h1.text-4xl').first();

    await expect(heading).toBeVisible();
    const headingText = await heading.textContent();

    expect(headingText?.trim()).toBe(linkText?.trim());
  });

  test('테마 토글이 작동한다', async ({ page }) => {
    await page.goto('/');

    // 테마 토글 버튼 찾기
    const themeButton = page.getByRole('button', { name: '테마 변경' });

    await expect(themeButton).toBeVisible();

    // 초기 테마 확인
    const initialTheme = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );

    // 테마 토글 버튼 클릭
    await themeButton.click();

    // 다크 모드 선택
    const darkMenuItem = page.getByRole('menuitem', { name: '다크' });

    await expect(darkMenuItem).toBeVisible();
    await darkMenuItem.click();

    // 테마가 변경될 때까지 기다림
    await page.waitForFunction(
      (initialTheme) =>
        document.documentElement.classList.contains('dark') !== initialTheme,
      initialTheme,
    );

    // 테마가 변경되었는지 확인
    const newTheme = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );

    expect(newTheme).not.toBe(initialTheme);
  });

  test('테이블 필터링이 작동한다', async ({ page }) => {
    await page.goto('/');

    // 테이블이 로드될 때까지 기다림
    const table = page.getByRole('table');

    await expect(table).toBeVisible();

    // 데이터가 로드될 때까지 기다림
    await page.waitForFunction(() => {
      const rows = document.querySelectorAll('tbody tr');

      return rows.length > 0;
    });

    // 상태 컬럼의 모든 버튼 찾기
    const statusButtons = page.getByRole('button', { name: '상태' });

    // 헤더의 상태 버튼 찾기 (첫 번째 상태 버튼)
    const statusButton = statusButtons.first();

    await expect(statusButton).toBeVisible();

    // 버튼 클릭
    await statusButton.click();

    // 클릭 후 변화 대기
    await page.waitForTimeout(1000);

    // 상태 필터 옵션들 찾기
    const filterOptions = page.locator(
      '[role="option"], [role="menuitem"], [class*="dropdown-item"]',
    );

    // 발행됨 옵션 찾기
    const publishedOption = filterOptions
      .filter({ hasText: '작성 중' })
      .first();

    await expect(publishedOption).toBeVisible({ timeout: 5000 });
    await publishedOption.click();

    // 필터링 결과가 적용될 때까지 기다림
    await page.waitForTimeout(2000);

    // 결과 확인
    const filteredStatuses = await page
      .locator('tbody tr td:nth-child(4)')
      .allTextContents();

    expect(filteredStatuses.length).toBeGreaterThan(0);
    expect(
      filteredStatuses.every((status) => status.includes('작성 중')),
    ).toBeTruthy();
  });
});
