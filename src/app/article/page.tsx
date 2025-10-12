"use client";
import './article.css'
import React from 'react';
import Image from 'next/image';

// --- TYPE DEFINITIONS ---
interface ArticleBody {
  mainTitle: string;
  paragraphs: string[];
  impactTitle: string;
  impactAreas: { heading: string; description: string; }[];
}

interface StructuredArticleItem {
  title: string;
  image: {
    src: string;
    alt: string;
  };
  body: ArticleBody;
}

// --- DATA ---
const ArticleData: StructuredArticleItem[] = [
  {
    title: 'The Future of AI in Everyday Life',
    image: {
      src: '/assets/article/fututre-of-ai.png',
      alt: 'A montage of movie and TV show posters'
    },
    body: {
      mainTitle: "The Future of AI in Everyday Life",
      paragraphs: [
        "Artificial intelligence is no longer a concept from science fiction; it's a part of our daily routines. From the smart assistants on our phones that set reminders and play music, to the recommendation algorithms that suggest what to watch next on streaming services, AI is seamlessly integrating into our lives.",
        "The real power of modern AI lies in its ability to learn and adapt. This technology helps power everything from advanced medical diagnostics to self-driving cars, promising a future that is safer, more efficient, and more personalized."
      ],
      impactTitle: "Key Areas of Impact",
      impactAreas: [
        {
          heading: "Healthcare",
          description: "AI algorithms can analyze medical images like X-rays and MRIs with incredible accuracy, often spotting diseases earlier than the human eye."
        },
        {
          heading: "Transportation",
          description: "Self-driving vehicles use complex AI systems to navigate roads, reduce accidents, and optimize traffic flow."
        },
        {
          heading: "Entertainment",
          description: "Your favorite playlists and recommended shows are curated by AI that understands your preferences."
        }
      ]
    }
  }
];

// --- COMPONENT ---
const ArticlePage: React.FC = () => {
  return (
    <section>
      <h1 id="articles">Articles</h1>
      <div className="article block">
        {ArticleData.map((article, index) => (
          <article key={index} className="article-item">
            <div className="article-image">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                width={700} // Provide base width for aspect ratio
                height={300} // Provide base height for aspect ratio
              />
            </div>
            <div className="article-text">
              <h1>{article.body.mainTitle}</h1>

              {article.body.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}

              <h2>{article.body.impactTitle}</h2>
              <ul>
                {article.body.impactAreas.map((area, aIndex) => (
                  <li key={aIndex}>
                    <strong>{area.heading}:</strong> {area.description}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ArticlePage;