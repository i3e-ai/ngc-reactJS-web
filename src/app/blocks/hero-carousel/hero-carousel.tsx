"use client";

import { useCallback, useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import './hero-carousel.css'
import { carouselSlides } from '@/app/data/carouselSlides';

interface CarouselItem {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface HeroCarouselProps {
  slides?: CarouselItem[];
}

export default function HeroCarousel({ slides = carouselSlides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);
  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return undefined;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, slides.length]);

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
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured content carousel"
    >
      <div
        className="carousel__track"
        aria-live="polite"
        aria-atomic="false"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slides.length}`}
            className={`carousel__slide ${index === currentSlide ? 'carousel__slide--active' : ''}`}
          >
            <figure className="carousel__image">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </figure>

            <nav className="carousel__content" aria-label="Slide content navigation">
              <h2 className="carousel__title">{slide.title}</h2>
              <p className="carousel__subtitle">{slide.subtitle}</p>
              <Link href={slide.buttonLink} className="carousel__button">
                {slide.buttonText}
              </Link>
            </nav>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <section>
          <button
            type="button"
            className="carousel__button-nav carousel__button-nav--prev"
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
            className="carousel__button-nav carousel__button-nav--next"
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
        </section>
      )}

      {slides.length > 1 && (
        <div className="carousel__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`carousel__dot ${index === currentSlide ? 'carousel__dot--active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {slides.length > 1 && (
        <button
          type="button"
          className="carousel__control-play-pause"
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
