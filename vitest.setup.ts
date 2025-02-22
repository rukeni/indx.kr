import '@testing-library/jest-dom/vitest';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// RTL matchers 확장
expect.extend(matchers);

// 각 테스트 이후 cleanup
afterEach(() => {
  cleanup();
});
