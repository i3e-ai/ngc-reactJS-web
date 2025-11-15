interface CarouselItem {
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export const carouselSlides: CarouselItem[] = [
  {
    image: '/assets/carousel/slide1.png',
    title: 'Welcome to Our Platform',
    subtitle: 'Discover Amazing Features',
    buttonText: 'Learn More',
    buttonLink: '/features',
  },
  {
    image: '/assets/carousel/slide2.png',
    title: 'Built for Performance',
    subtitle: 'Lightning Fast Experience',
    buttonText: 'Explore Now',
    buttonLink: '/performance',
  },
  {
    image: '/assets/carousel/slide3.jpg',
    title: 'Edge Delivery Services',
    subtitle: 'Ready for your content',
    buttonText: 'See Details',
    buttonLink: '/security',
  },
];
