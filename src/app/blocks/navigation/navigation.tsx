import Image from 'next/image';
import Link from 'next/link'; // 1. Import the Link component
import './navigation.css';

// The updated interfaces and data from Step 1 go here...

// Your updated data structure
interface DropdownContent {
  mainHref: string;
  links?: { text: string; href: string }[];
  featured?: {
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
  };
}

const navigationData: Record<string, DropdownContent> = {
  'Home': {
    mainHref: '/#',
  },
  'Products': {
    mainHref: '/products',
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
    mainHref: '/article',
    links: [
      { text: 'Home', href: '/article' },
      { text: 'Work', href: '/article' },
      { text: 'Fitness', href: '/article' },
      { text: 'Innovation', href: '/article' }
    ],
    featured: {
      image: '/assets/dropdown-content/article.png',
      title: 'Latest Articles',
      subtitle: 'Stay updated with industry trends',
      buttonText: 'Read More',
      buttonLink: '/article'
    }
  },
  'Blogs': {
    mainHref: '/blog',
    links: [
      { text: 'Travel', href: '/blog' },
      { text: 'Music', href: '/blog' },
      { text: 'Sports', href: '/blog' },
      { text: 'News', href: '/blog' }
    ],
    featured: {
      image: '/assets/dropdown-content/blogs.png',
      title: 'Featured Blog',
      subtitle: 'Expert insights and analysis',
      buttonText: 'Start Reading',
      buttonLink: '/blog'
    }
  },
  'Press Release': {
    mainHref: '/press-release',
    links: [
      { text: 'General', href: '/press-release' },
      { text: 'Products', href: '/press-release' },
      { text: 'Financial Results', href: '/press-release' }
    ],
    featured: {
      image: '/assets/dropdown-content/press-release.jpg',
      title: 'Latest Press Release',
      subtitle: 'Stay informed about our latest developments',
      buttonText: 'View All News',
      buttonLink: '/press-release'
    }
  }
};


export default function Navigation({ isOpen }: { isOpen: boolean }) {
  return (
    <nav className={`nav-sections ${isOpen ? 'is-open' : ''}`}>
      <ul className="nav-menu">
        {Object.entries(navigationData).map(([key, content]) => (
          <li key={key} className={`has-dropdown ${!content.links ? 'no-dropdown' : ''}`}>
            {/* 2. Replace top-level <a> with <Link> */}
            <Link href={content.mainHref}>{key}</Link>
            <div className="dropdown-content">
              <div className="dropdown-container">
                <div className="dropdown-nav">
                  {content.links?.map((link, index) => (
                    // 3. Replace dropdown <a> with <Link>
                    <Link key={index} href={link.href}>{link.text}</Link>
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
                      {/* 4. Replace button <a> with <Link> */}
                      <Link href={content.featured.buttonLink} className="overlay-button">
                        {content.featured.buttonText}
                      </Link>
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