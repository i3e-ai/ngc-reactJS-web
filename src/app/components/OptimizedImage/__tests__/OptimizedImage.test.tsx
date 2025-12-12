import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OptimizedImage from '../OptimizedImage';

describe('OptimizedImage Component', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    width: 800,
    height: 600,
  };

  it('renders image with correct alt text', () => {
    render(<OptimizedImage {...defaultProps} />);

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<OptimizedImage {...defaultProps} className="custom-class" />);

    const container = screen.getByAltText('Test image').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('shows loading state initially', () => {
    render(<OptimizedImage {...defaultProps} />);

    const container = screen.getByAltText('Test image').closest('div');
    expect(container).toHaveClass('animate-pulse');
  });

  it('removes loading state after image loads', async () => {
    render(<OptimizedImage {...defaultProps} />);

    const image = screen.getByAltText('Test image');

    // Simulate image load
    const loadEvent = new Event('load', { bubbles: true });
    Object.defineProperty(loadEvent, 'target', { writable: false, value: image });
    image.dispatchEvent(loadEvent);

    await waitFor(() => {
      const container = screen.getByAltText('Test image').closest('div');
      expect(container).not.toHaveClass('animate-pulse');
    });
  });

  it('displays fallback on image error', async () => {
    render(<OptimizedImage {...defaultProps} />);

    const image = screen.getByAltText('Test image');

    // Simulate image error
    const errorEvent = new Event('error', { bubbles: true });
    Object.defineProperty(errorEvent, 'target', { writable: false, value: image });
    image.dispatchEvent(errorEvent);

    await waitFor(() => {
      expect(screen.getByText('Image failed to load')).toBeInTheDocument();
    });
  });

  it('applies priority prop correctly', () => {
    render(<OptimizedImage {...defaultProps} priority={true} />);

    const image = screen.getByAltText('Test image');
    expect(image).toBeInTheDocument();
  });
});
