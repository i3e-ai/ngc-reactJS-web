import React from 'react';
import './highlight.css';

interface Slide {
  id: string;
  title: string;
  text: string;
}

const slides: Slide[] = [
  { id: 'breaking-news', title: 'Breaking News:', text: 'Component successfully converted to Next.js and TSX.' },
  { id: 'special-offer', title: 'Special Offer:', text: 'Enjoy improved security and type safety!' },
  { id: 'system-update', title: 'System Update:', text: 'Now using CSS Modules for scoped styling.' },
  { id: 'pro-tip', title: 'Pro Tip:', text: 'Data is now self-contained within the component.' },
];

const Highlight: React.FC = () => {
  if (!slides || slides.length === 0) {
    return null;
  }

  // Duplicate the slides array to create a seamless looping effect
  const duplicatedSlides = [...slides, ...slides];

  return (
    <div className="highlight-slides-container">
      <div className="scrolling-wrapper">
        {duplicatedSlides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className="highlight-slide"
            role="status"
            aria-live="polite"
          >
            <div>
              <h2>{slide.title}</h2>
              <p>{slide.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highlight;