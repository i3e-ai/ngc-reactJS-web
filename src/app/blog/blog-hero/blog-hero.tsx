import React from 'react';
import './blog-hero.css'

interface BlogHeroProps {
  imageUrl: string;
  contentHTML: string;
}

const BlogHero: React.FC<BlogHeroProps> = ({ imageUrl, contentHTML }) => {
  return (
    <section
      className="blog-hero block"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div
        className="hero-content"
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      />
    </section>
  );
};

export default BlogHero;