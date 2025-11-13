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

export const contentCuratorData: GalleryItem[] = [
  {
    eyebrow: 'Entertainment',
    title: 'All your entertainment in one place.',
    link: { href: '#', text: 'Explore' },
    image: {
      src: '/assets/content-curator/entertainment.jpg',
      alt: 'A montage of movie and TV show posters',
    },
  },
  {
    eyebrow: 'Photography',
    title: 'Your photos, stunningly organized.',
    link: { href: '#', text: "See what's new in Photos" },
    image: {
      src: '/assets/content-curator/photography.jpg',
      alt: 'A vibrant landscape photograph',
    },
  },
  {
    eyebrow: 'Productivity',
    title: 'Turn your to-dos into dones.',
    link: { href: '#', text: 'Discover Reminders' },
    image: {
      src: '/assets/content-curator/productivity.jpg',
      alt: 'A checklist being marked as complete',
    },
  },
];