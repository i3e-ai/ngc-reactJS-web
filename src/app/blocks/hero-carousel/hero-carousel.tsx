"use client";

import { useCallback, useEffect, useState } from "react";
import Image from 'next/image';
import './hero-carousel.css';

interface CarouselItem {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const slides: CarouselItem[] = [
  {
    image: '/assets/carousel/slide1.png',
    title: 'Welcome to Our Platform',
    subtitle: 'Discover Amazing Features',
    buttonText: 'Learn More',
    buttonLink: '/features'
  },
  {
    image: '/assets/carousel/slide2.png',
    title: 'Built for Performance',
    subtitle: 'Lightning Fast Experience',
    buttonText: 'Explore Now',
    buttonLink: '/performance'
  },
  {
    image: '/assets/carousel/slide3.jpg',
    title: 'Secure by Design',
    subtitle: 'Your Safety is Our Priority',
    buttonText: 'See Details',
    buttonLink: '/security'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return undefined;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
        setIsAutoPlaying(false);
      } else if (e.key === 'ArrowRight') {
        goToNext();
        setIsAutoPlaying(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const handleDotClick = (index: number) => {
    goToSlide(index);
    setIsAutoPlaying(false);
  };

  const handleNavClick = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      goToPrev();
    } else {
      goToNext();
    }
    setIsAutoPlaying(false);
  };

  if (slides.length === 0) {
    return <div className="hero-carousel-empty">No slides available</div>;
  }

  return (
    <div className="hero-carousel-container">
      <div className="hero-carousel-track">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="slide-image">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
            <div className="slide-text">
              <h2 className="slide-title">{slide.title}</h2>
              <h3 className="slide-subtitle">{slide.subtitle}</h3>
              <a href={slide.buttonLink} className="slide-button">
                {slide.buttonText}
              </a>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            className="carousel-nav prev"
            onClick={() => handleNavClick('prev')}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="carousel-nav next"
            onClick={() => handleNavClick('next')}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {slides.length > 1 && (
        <button
          type="button"
          className="carousel-play-pause"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          aria-label={isAutoPlaying ? 'Pause carousel' : 'Play carousel'}
        >
          {isAutoPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
