import React from 'react';
import './blog-content.css';

interface BlogContentProps {
  bodyHTML: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ bodyHTML }) => {
  return (
    <section className="blog-content block">
      <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />
    </section>
  );
};

export default BlogContent;