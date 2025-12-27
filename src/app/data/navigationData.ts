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

export const navigationData: Record<string, DropdownContent> = {
  Home: {
    mainHref: '/#',
  },
  Products: {
    mainHref: '/products',
    links: [
      { text: 'Phone', href: '/products' },
      { text: 'Laptop', href: '/products' },
      { text: 'Headphone', href: '/products' },
      { text: 'Tablet', href: '/products' },
    ],
    featured: {
      image: '/assets/dropdown-content/products.jpg',
      title: 'New Product Launch',
      subtitle: 'Explore our Products',
      buttonText: 'Learn More',
      buttonLink: '/new-product',
    },
  },
  Article: {
    mainHref: '/article',
    links: [
      { text: 'Home', href: '/article' },
      { text: 'Work', href: '/article' },
      { text: 'Fitness', href: '/article' },
      { text: 'Innovation', href: '/article' },
    ],
    featured: {
      image: '/assets/dropdown-content/article.png',
      title: 'Latest Articles',
      subtitle: 'Stay updated with industry trends',
      buttonText: 'Read More',
      buttonLink: '/article',
    },
  },
  Blogs: {
    mainHref: '/blog',
    links: [
      { text: 'Travel', href: '/blog' },
      { text: 'Music', href: '/blog' },
      { text: 'Sports', href: '/blog' },
      { text: 'News', href: '/blog' },
    ],
    featured: {
      image: '/assets/dropdown-content/blogs.png',
      title: 'Featured Blog',
      subtitle: 'Expert insights and analysis',
      buttonText: 'Start Reading',
      buttonLink: '/blog',
    },
  },
  'Press Release': {
    mainHref: '/press-release',
    links: [
      { text: 'General', href: '/press-release' },
      { text: 'Products', href: '/press-release' },
      { text: 'Financial Results', href: '/press-release' },
    ],
    featured: {
      image: '/assets/dropdown-content/press-release.jpg',
      title: 'Latest Press Release',
      subtitle: 'Stay informed about our latest developments',
      buttonText: 'View All News',
      buttonLink: '/press-release',
    },
  },
};