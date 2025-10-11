"use client"; // Required for components with user interaction like hover effects

import Image from 'next/image';
import './content-curator.css'; // Make sure you're importing the CSS file

// (The GalleryItem interface remains the same)
interface GalleryItem {
  eyebrow: string;
  title: string;
  link: {
    href: string;
    text: string;
  };
  image: {
    src: string;
    alt: string;
  };
}

const curatorData: GalleryItem[] = [
  {
    eyebrow: 'Entertainment',
    title: 'All your entertainment in one place.',
    link: { href: '#', text: 'Explore Apple TV+' },
    image: { src: '/assets/content-curator/entertainment.jpg', alt: 'A montage of movie and TV show posters' },
  },
  {
    eyebrow: 'Photography',
    title: 'Your photos, stunningly organized.',
    link: { href: '#', text: 'See what\'s new in Photos' },
    image: { src: '/assets/content-curator/photography.jpg', alt: 'A vibrant landscape photograph' },
  },
  {
    eyebrow: 'Productivity',
    title: 'Turn your to-dos into dones.',
    link: { href: '#', text: 'Discover Reminders' },
    image: { src: '/assets/content-curator/productivity.jpg', alt: 'A checklist being marked as complete' },
  },
];

const ContentCurator: React.FC = () => {
  // We combine the data with itself to create the seamless loop effect
  const duplicatedData = [...curatorData, ...curatorData];

  return (
    <div className="content-curator-block">
      <div className="curator-container">
        <div className="curator-header">
          <h2 className="curator-title">Discover what you can do</h2>
        </div>
        {/* This wrapper is our "viewport" for the animation */}
        <div className="curator-gallery-wrapper">
          <div className="curator-gallery">
            {duplicatedData.map((item, index) => (
              <div className="gallery-item" key={index}>
                <div className="item-media">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={800}
                    height={450}
                  />
                </div>
                <div className="item-content">
                  <h4 className="item-eyebrow">{item.eyebrow}</h4>
                  <h3 className="item-title">{item.title}</h3>
                  <a href={item.link.href} className="item-link">
                    {item.link.text}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCurator;