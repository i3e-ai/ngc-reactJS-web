// src/app/blog/page.tsx

import React from 'react';
import { Metadata } from 'next';
import BlogHero from './blog-hero/blog-hero'
import BlogContent from './blog-content/blog-content';
import StructuredData from '../components/StructuredData/StructuredData';
import { generateBlogPostingSchema } from '../utils/structured-data';

export const metadata: Metadata = {
  title: "The Future of AI in 2025",
  description: "A deep dive into the trends shaping our world. Explore how AI continues to evolve and the key developments expected in 2025, from generative AI to autonomous systems.",
  keywords: ["AI", "artificial intelligence", "2025", "technology trends", "generative AI", "machine learning"],
  openGraph: {
    title: "The Future of AI in 2025 | NGC Blog",
    description: "A deep dive into the AI trends shaping our world in 2025.",
    type: "article",
    url: "https://ngc-website.com/blog",
    images: [
      {
        url: "/assets/blog/future-of-ai.jpg",
        width: 1200,
        height: 630,
        alt: "The Future of AI in 2025",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Future of AI in 2025",
    description: "A deep dive into the AI trends shaping our world.",
    images: ["/assets/blog/future-of-ai.jpg"],
  },
};

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

const blogSchema = generateBlogPostingSchema({
  title: 'The Future of AI in 2025',
  description: 'A deep dive into the trends shaping our world. Explore how AI continues to evolve and the key developments expected in 2025.',
  image: 'https://ngc-website.com/assets/blog/future-of-ai.jpg',
  datePublished: '2025-01-15',
  dateModified: '2025-01-15',
  author: 'NGC Tech Team',
  url: 'https://ngc-website.com/blog',
  keywords: ['AI', 'artificial intelligence', '2025', 'technology trends', 'generative AI'],
});

const BlogPage: React.FC = () => {
  return (
    <>
      <StructuredData data={blogSchema} />
      <main>
        <BlogHero
          imageUrl={heroData.imageUrl}
          contentHTML={heroData.contentHTML}
        />
        <BlogContent bodyHTML={articleBodyHTML} />
      </main>
    </>
  );
};

export default BlogPage;