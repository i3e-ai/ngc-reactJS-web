import { FC } from 'react';
import Image from 'next/image';
import './navigation.css';

interface DropdownContent {
  links: { text: string; href: string }[];
  featured?: {
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
}

interface NavigationProps {
  isOpen: boolean;
}

const navigationData: Record<string, DropdownContent> = {
  'Products': {
    links: [
      { text: 'Software Solutions', href: '/products/software' },
      { text: 'Hardware Products', href: '/products/hardware' },
      { text: 'Services', href: '/products/services' }
    ],
    featured: {
      image: '/featured-product.jpg',
      title: 'New Product Launch',
      subtitle: 'Discover our latest innovation',
      buttonText: 'Learn More',
      buttonLink: '/new-product'
    }
  },
  'Article': {
    links: [
      { text: 'Technology', href: '/articles/tech' },
      { text: 'Business', href: '/articles/business' },
      { text: 'Innovation', href: '/articles/innovation' }
    ],
    featured: {
      image: '/featured-article.jpg',
      title: 'Latest Articles',
      subtitle: 'Stay updated with industry trends',
      buttonText: 'Read More',
      buttonLink: '/articles'
    }
  },
  'Blogs': {
    links: [
      { text: 'Tech Blogs', href: '/blogs/tech' },
      { text: 'Business Blogs', href: '/blogs/business' },
      { text: 'Tutorial Blogs', href: '/blogs/tutorials' },
      { text: 'Case Studies', href: '/blogs/case-studies' }
    ],
    featured: {
      image: '/featured-blog.jpg',
      title: 'Featured Blog',
      subtitle: 'Expert insights and analysis',
      buttonText: 'Start Reading',
      buttonLink: '/blogs/featured'
    }
  },
  'Press Release': {
    links: [
      { text: 'Company News', href: '/press/news' },
      { text: 'Media Coverage', href: '/press/media' },
      { text: 'Events', href: '/press/events' },
      { text: 'Awards', href: '/press/awards' }
    ],
    featured: {
      image: '/featured-press.jpg',
      title: 'Latest Press Release',
      subtitle: 'Stay informed about our latest developments',
      buttonText: 'View All News',
      buttonLink: '/press/all'
    }
  }
};

const Navigation: FC<NavigationProps> = ({ isOpen }) => {
  return (
    <nav className={`nav-sections ${isOpen ? 'is-open' : ''}`}>
      <ul className="nav-menu">
        {Object.entries(navigationData).map(([key, content]) => (
          <li key={key} className="has-dropdown">
            <a href="#">{key}</a>
            <div className="dropdown-content">
              <div className="dropdown-container">
                <div className="dropdown-nav">
                  {content.links.map((link, index) => (
                    <a key={index} href={link.href}>{link.text}</a>
                  ))}
                </div>
                {content.featured && (
                  <div className="dropdown-image">
                    <Image
                      src={content.featured.image}
                      alt={content.featured.title}
                      className="dropdown-featured-img"
                      width={700}
                      height={560}
                    />
                    <div className="image-overlay">
                      <h2 className="overlay-title">{content.featured.title}</h2>
                      <p className="overlay-subtitle">{content.featured.subtitle}</p>
                      <a href={content.featured.buttonLink} className="overlay-button">
                        {content.featured.buttonText}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;