import type { ReactElement } from 'react';
import type { RenderOptions } from '@testing-library/react';

import { render } from '@testing-library/react';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): ReturnType<typeof render> => render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };
