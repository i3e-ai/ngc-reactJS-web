import React from 'react';
import './highlight.css';

interface Slide {
  title: string;
  text: string;
}

const slides: Slide[] = [
  { title: 'Breaking News:', text: 'Component successfully converted to Next.js and TSX.' },
  { title: 'Special Offer:', text: 'Enjoy improved security and type safety!' },
  { title: 'System Update:', text: 'Now using CSS Modules for scoped styling.' },
  { title: 'Pro Tip:', text: 'Data is now self-contained within the component.' },
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
            key={index} // Using index is acceptable here as the list is static
            className="highlight-slide"
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