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
      { text: 'Phone', href: '/products' },
      { text: 'Laptop', href: '/products' },
      { text: 'Headphone', href: '/products' },
      { text: 'Tablet', href: '/products' }
      
    ],
    featured: {
      image: '/assets/dropdown-content/products.jpg',
      title: 'New Product Launch',
      subtitle: 'Explore our Products',
      buttonText: 'Learn More',
      buttonLink: '/new-product'
    }
  },
  'Article': {
    links: [
      { text: 'Home', href: '/articles' },
      { text: 'Work', href: '/articles' },
      { text: 'Fitness', href: '/articles' },
      { text: 'Innovation', href: '/articles' }
    ],
    featured: {
      image: '/assets/dropdown-content/article.png',
      title: 'Latest Articles',
      subtitle: 'Stay updated with industry trends',
      buttonText: 'Read More',
      buttonLink: '/articles'
    }
  },
  'Blogs': {
    links: [
      { text: 'Travel', href: '/blogs' },
      { text: 'Music', href: '/blogs' },
      { text: 'Sports', href: '/blogs' },
      { text: 'News', href: '/blogs' }
    ],
    featured: {
      image: '/assets/dropdown-content/blogs.png',
      title: 'Featured Blog',
      subtitle: 'Expert insights and analysis',
      buttonText: 'Start Reading',
      buttonLink: '/blogs/featured'
    }
  },
  'Press Release': {
    links: [
      { text: 'General', href: '/press' },
      { text: 'Products', href: '/press' },
      { text: 'Financial Results', href: '/press' }
    ],
    featured: {
      image: '/assets/dropdown-content/press-release.png',
      title: 'Latest Press Release',
      subtitle: 'Stay informed about our latest developments',
      buttonText: 'View All News',
      buttonLink: '/press/all'
    }
  }
};

export default function Navigation({ isOpen }: NavigationProps) {
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
}
