// src/app/blog/page.tsx

import React from 'react';
import BlogHero from './blog-hero/blog-hero'
import BlogContent from './blog-content/blog-content';

const heroData = {
  imageUrl: 'assets/blog/future-of-ai.jpg', // URL from your /public folder
  contentHTML: `
    <h1>The Future of AI in  2025</h1>
    <p>A deep dive into the trends shaping our world.</p>
  `,
};

const articleBodyHTML = `
  <h2>The Future of AI in 2025</h2>
  <br>
  <p>Artificial Intelligence (AI) continues to evolve at a breathtaking pace. As we look towards 2025, several key trends are set to redefine industries and our daily lives. From generative AI becoming a standard business tool to advancements in autonomous systems, the landscape is shifting rapidly.
This article explores the most significant developments we can expect.
</p>
  <ul>
    <li><strong>Generative AI in the Enterprise:</strong> Beyond creative pursuits, generative AI is becoming integral to software development, marketing, and data analysis, automating complex tasks and boosting productivity</li>
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