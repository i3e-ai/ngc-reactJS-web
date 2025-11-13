"use client";

import Image from 'next/image';
import './content-curator.css';
import { contentCuratorData } from '@/app/data/contentCuratorData';

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

interface ContentCuratorProps {
  curatorData?: GalleryItem[];
}

const ContentCurator: React.FC<ContentCuratorProps> = ({ curatorData = contentCuratorData }) => {
  // Duplicate data 3 times for seamless infinite scroll loop
  const scrollData = [...curatorData, ...curatorData, ...curatorData];

  return (
    <div className="content-curator-block">
      <div className="curator-container">
        <div className="curator-header">
          <h2 className="curator-title">Discover what you can do</h2>
        </div>
        <div className="curator-gallery-wrapper">
          <div className="curator-gallery">
            {scrollData.map((item, index) => (
              <div className="gallery-item" key={index}>
                <div className="item-media">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={400}
                    height={300}
                    loading="lazy"
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