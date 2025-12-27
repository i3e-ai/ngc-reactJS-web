import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroCarousel from '../hero-carousel';

const mockSlides = [
  {
    image: '/test-image-1.jpg',
    title: 'Slide 1 Title',
    subtitle: 'Slide 1 Subtitle',
    buttonText: 'Learn More 1',
    buttonLink: '/slide-1',
  },
  {
    image: '/test-image-2.jpg',
    title: 'Slide 2 Title',
    subtitle: 'Slide 2 Subtitle',
    buttonText: 'Learn More 2',
    buttonLink: '/slide-2',
  },
  {
    image: '/test-image-3.jpg',
    title: 'Slide 3 Title',
    subtitle: 'Slide 3 Subtitle',
    buttonText: 'Learn More 3',
    buttonLink: '/slide-3',
  },
];

describe('HeroCarousel Component', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders carousel with first slide', () => {
    render(<HeroCarousel slides={mockSlides} />);

    expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
    expect(screen.getByText('Slide 1 Subtitle')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn more 1/i })).toBeInTheDocument();
  });

  it('navigates to next slide when next button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<HeroCarousel slides={mockSlides} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();
  });

  it('navigates to previous slide when previous button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    render(<HeroCarousel slides={mockSlides} />);

    const prevButton = screen.getByRole('button', { name: /previous/i });
    await user.click(prevButton);

    expect(screen.getByText('Slide 3 Title')).toBeInTheDocument();
  });

  it('navigates using keyboard arrow keys', () => {
    render(<HeroCarousel slides={mockSlides} />);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();
  });

  it('renders navigation dots for each slide', async () => {
    const user = userEvent.setup({ delay: null });
    render(<HeroCarousel slides={mockSlides} />);

    const dots = screen.getAllByRole('button').filter(
      (button) => button.getAttribute('aria-label')?.includes('Go to slide')
    );
    expect(dots).toHaveLength(mockSlides.length);

    // Click on second dot
    await user.click(dots[1]);
    expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();
  });

  it('auto-advances slides after 5 seconds', () => {
    render(<HeroCarousel slides={mockSlides} />);

    expect(screen.getByText('Slide 1 Title')).toBeInTheDocument();

    jest.advanceTimersByTime(5000);

    expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();
  });

  it('stops auto-play when user interacts', async () => {
    const user = userEvent.setup({ delay: null });
    render(<HeroCarousel slides={mockSlides} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    // After clicking, auto-play should stop
    expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();

    jest.advanceTimersByTime(5000);

    // Should still be on slide 2, not auto-advanced to slide 3
    expect(screen.getByText('Slide 2 Title')).toBeInTheDocument();
  });

  it('displays empty state when no slides provided', () => {
    render(<HeroCarousel slides={[]} />);

    expect(screen.getByText('No slides available')).toBeInTheDocument();
  });
});
