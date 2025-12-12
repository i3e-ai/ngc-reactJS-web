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
    <div className="curator">
      <div className="curator__container">
        <div className="curator__header">
          <h2 className="curator__title">Discover what you can do</h2>
        </div>
        <div className="curator__gallery-wrapper">
          <div className="curator__gallery">
            {scrollData.map((item, index) => (
              <div className="curator__item" key={index}>
                <div className="curator__media">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    width={400}
                    height={300}
                    loading="lazy"
                  />
                </div>
                <div className="curator__content">
                  <h3 className="curator__eyebrow">{item.eyebrow}</h3>
                  <h4 className="curator__item-title">{item.title}</h4>
                  <a href={item.link.href} className="curator__link">
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