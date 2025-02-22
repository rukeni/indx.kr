import { describe, it, expect } from 'vitest';

import { Button } from '@internal/components/ui/button';

import { render, screen } from '../../lib/test-utils';

describe('Button', () => {
  it('renders button with correct text', () => {
    render(<Button>Test Button</Button>);
    expect(
      screen.getByRole('button', { name: /test button/i }),
    ).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });

    await button.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });

    expect(button).toBeDisabled();
  });
});
