import React from 'react';
import { render, screen } from '@testing-library/react';
import Quote from '../quote';

describe('Quote Component', () => {
  it('renders quote section', () => {
    render(<Quote />);

    const section = screen.getByRole('blockquote');
    expect(section).toBeInTheDocument();
  });

  it('displays quote text', () => {
    render(<Quote />);

    const quoteText = screen.getByText(/In open source, we feel strongly/i);
    expect(quoteText).toBeInTheDocument();
  });

  it('displays author name', () => {
    render(<Quote />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays author title', () => {
    render(<Quote />);

    expect(screen.getByText('Sr. Software Engineer')).toBeInTheDocument();
  });

  it('wraps quote in blockquote element', () => {
    render(<Quote />);

    const blockquote = screen.getByText(/In open source/i).closest('blockquote');
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveClass('quote__text');
  });
});
