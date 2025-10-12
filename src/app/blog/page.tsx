// src/app/blog/page.tsx

import React from 'react';
import BlogHero from './blog-hero/blog-hero'
import BlogContent from './blog-content/blog-content';

const heroData = {
  imageUrl: '/images/blog-hero-background.jpg', // URL from your /public folder
  contentHTML: `
    <h1>The Art of Modern Web Development</h1>
    <p>By Jane Doe | Published on October 12, 2025</p>
  `,
};

const articleBodyHTML = `
  <p>Modern web development is a constantly evolving landscape. What was best practice just a few years ago might be considered legacy today.</p>
  <h2>Key Principles to Follow</h2>
  <ul>
    <li><strong>Component-Based Architecture:</strong> Breaking UIs into reusable components allows for more maintainable and scalable codebases.</li>
    <li><strong>Performance First:</strong> Optimizing for speed is no longer an afterthought.</li>
    <li><strong>Accessibility (a11y):</strong> Building inclusive websites is a fundamental responsibility.</li>
  </ul>
`;

const BlogPage: React.FC = () => {
  return (
    <main>
      <BlogHero
        imageUrl={heroData.imageUrl}
        contentHTML={heroData.contentHTML}
      />
      <BlogContent bodyHTML={articleBodyHTML} />
    </main>
  );
};

export default BlogPage;