import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../footer';

describe('Footer Component', () => {
  it('renders footer with company information', () => {
    render(<Footer />);

    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText(/Company Description/i)).toBeInTheDocument();
    expect(screen.getByText(/email: info@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone: \+1 234 567 890/i)).toBeInTheDocument();
  });

  it('renders quick links section', () => {
    render(<Footer />);

    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument();
  });

  it('renders footer bottom with copyright', () => {
    render(<Footer />);

    expect(screen.getByText('All Rights Reserved')).toBeInTheDocument();
  });

  it('has correct link hrefs', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /products/i })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blog');
  });
});
