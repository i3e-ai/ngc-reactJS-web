import React from 'react';
import "./quote.css"

interface QuoteProps {
  author: string;
  quote: string;
  title: string;
}

const quotesData = [
  {
    author: "John Doe",
    quote: "In open source, we feel strongly that to really do something well, you have to get a lot of people involved.",
    title: "Sr. Software Engineer",
  },
];

export default function Quote() {
  return (
    <div className="quote-block">
      {quotesData.map((item, index) => (
        <div key={index}>
          <blockquote className="quote-text">
            &quot;{item.quote}&quot;
          </blockquote>
          <footer className="quote-author-info">
            <span className="quote-author">{item.author}</span>
            <cite className="quote-title">{item.title}</cite>
          </footer>
        </div>
      ))}
    </div>
  );
}