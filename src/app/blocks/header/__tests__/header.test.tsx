import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../header';

// Mock the Navigation component to isolate Header testing
jest.mock('../../navigation/navigation', () => {
  return function MockNavigation({ onLinkClick }: { isOpen: boolean; onLinkClick: () => void }) {
    return (
      <nav data-testid="mock-navigation">
        <button onClick={onLinkClick}>Mock Link</button>
      </nav>
    );
  };
});

describe('Header Component', () => {
  beforeEach(() => {
    document.body.className = '';
  });

  it('renders logo and title', () => {
    render(<Header />);

    expect(screen.getByText('NGC Platform')).toBeInTheDocument();
    expect(screen.getByAltText(/NGC.*Logo/i)).toBeInTheDocument();
  });

  it('toggles menu open and closed', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });

    // Initially closed
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    await user.click(hamburgerButton);
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');
    expect(document.body).toHaveClass('no-scroll');

    // Click to close
    await user.click(hamburgerButton);
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    expect(document.body).not.toHaveClass('no-scroll');
  });

  it('closes menu on Escape key', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });

    // Open menu
    await user.click(hamburgerButton);
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('closes menu when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Header />
        <div data-testid="outside">Outside content</div>
      </>
    );

    const hamburgerButton = screen.getByRole('button', { name: /toggle navigation menu/i });

    // Open menu
    await user.click(hamburgerButton);
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true');

    // Click outside
    fireEvent.click(screen.getByTestId('outside'));

    await waitFor(() => {
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false');
    });
  });
});
