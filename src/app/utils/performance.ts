import { Metadata } from 'next';

export const fontMetadata: Metadata = {
  other: {
    'preload-font-sora': '/fonts/sora-subset.woff2',
    'preload-font-geist': '/fonts/geist-subset.woff2',
  },
};

// Font loading strategy
export const fontLoadingStrategy = {
  // Critical fonts should be preloaded
  critical: ['--font-sora'],

  // Non-critical fonts can be loaded later
  deferred: ['--font-geist'],

  // Font display strategy
  display: 'swap' as const,

  // Subset optimization
  subsets: ['latin'] as const,
};

// Performance optimizations
export const imageOptimizations = {
  // Format preferences (most to least preferred)
  formats: ['image/avif', 'image/webp', 'image/png'],

  // Quality settings by context
  quality: {
    hero: 85,
    thumbnail: 75,
    icon: 90,
    background: 70,
  },

  // Size breakpoints
  breakpoints: [640, 750, 828, 1080, 1200, 1920],

  // Lazy loading threshold
  lazyThreshold: '200px',
};
