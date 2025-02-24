import { describe, it, expect } from 'vitest';

import Home from './page';
import { render, screen } from '../lib/test-utils';

describe('Home Page', () => {
  it('renders the Next.js logo', () => {
    render(<Home />);
    const logo = screen.getByAltText('Next.js logo');

    expect(logo).toBeInTheDocument();
  });

  it('renders the getting started text', () => {
    render(<Home />);
    expect(screen.getByText(/Get started by editing/i)).toBeInTheDocument();
    expect(screen.getByText(/app\/page\.tsx/i)).toBeInTheDocument();
  });

  it('renders the deploy button', () => {
    render(<Home />);
    const deployButton = screen.getByText(/Deploy now/i);

    expect(deployButton).toBeInTheDocument();
    expect(deployButton.tagName.toLowerCase()).toBe('a');
    expect(deployButton).toHaveAttribute(
      'href',
      expect.stringContaining('vercel.com/new'),
    );
  });

  it('renders the Vercel logo', () => {
    render(<Home />);
    const vercelLogo = screen.getByAltText('Vercel logomark');

    expect(vercelLogo).toBeInTheDocument();
  });
});
