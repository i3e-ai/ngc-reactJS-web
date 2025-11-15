import React from 'react';
import './blog-hero.css'

interface BlogHeroProps {
  imageUrl: string;
  contentHTML: string;
}

const BlogHero: React.FC<BlogHeroProps> = ({ imageUrl, contentHTML }) => {
  return (
    <section
      className="blog-hero"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <header
        className="blog-hero__content"
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      />
    </section>
  );
};

export default BlogHero;