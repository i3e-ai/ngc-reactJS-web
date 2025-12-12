import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from '../navigation';

describe('Navigation Component', () => {
  const mockOnLinkClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation menu', () => {
    render(<Navigation isOpen={true} onLinkClick={mockOnLinkClick} />);

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });

  it('shows open state when isOpen is true', () => {
    render(<Navigation isOpen={true} onLinkClick={mockOnLinkClick} />);

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).toHaveClass('nav--open');
  });

  it('hides when isOpen is false', () => {
    render(<Navigation isOpen={false} onLinkClick={mockOnLinkClick} />);

    const nav = screen.getByRole('navigation', { name: /main navigation/i });
    expect(nav).not.toHaveClass('nav--open');
  });

  it('handles keyboard navigation with arrow keys', () => {
    render(<Navigation isOpen={true} onLinkClick={mockOnLinkClick} />);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });

    // Just verify no errors occur during keyboard navigation
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });

  it('closes menu on Escape key', () => {
    render(<Navigation isOpen={true} onLinkClick={mockOnLinkClick} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(mockOnLinkClick).toHaveBeenCalledTimes(1);
  });

  it('calls onLinkClick when navigation link is clicked', async () => {
    const user = userEvent.setup();
    render(<Navigation isOpen={true} onLinkClick={mockOnLinkClick} />);

    const links = screen.getAllByRole('link');
    if (links.length > 0) {
      await user.click(links[0]);
      expect(mockOnLinkClick).toHaveBeenCalled();
    }
  });
});
