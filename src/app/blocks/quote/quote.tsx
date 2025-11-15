import React from 'react';
import "./quote.css"

const quotesData = [
  {
    author: "John Doe",
    quote: "In open source, we feel strongly that to really do something well, you have to get a lot of people involved.",
    title: "Sr. Software Engineer",
  },
];

export default function Quote() {
  return (
    <section className="quote">
      {quotesData.map((item, index) => (
        <div key={index} className="quote__item">
          <blockquote className="quote__text">
            &quot;{item.quote}&quot;
          </blockquote>
          <footer className="quote__footer">
            <span className="quote__author">{item.author}</span>
            <cite className="quote__title">{item.title}</cite>
          </footer>
        </div>
      ))}
    </section>
  );
}