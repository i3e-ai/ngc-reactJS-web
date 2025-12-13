/**
 * PURPOSE: Generate Schema.org structured data (JSON-LD) for SEO
 * WORKING: Provides functions to create structured data for various content types
 */

import type { Product } from '../blocks/product-listing/product-listing';

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'NGC',
  url: 'https://ngc-website.com',
  logo: 'https://ngc-website.com/assets/logo.png',
  description:
    'Next Generation Commerce Platform providing cutting-edge products and services',
  sameAs: [
    'https://facebook.com/ngc',
    'https://twitter.com/ngc',
    'https://linkedin.com/company/ngc',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@ngc-website.com',
  },
};

// Website Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NGC',
  url: 'https://ngc-website.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate:
        'https://ngc-website.com/products?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Product Schema Generator
export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.sales_category_title,
    image: product.image,
    description:
      product.description || `${product.sales_category_title} - ${product.sku}`,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: 'NGC',
    },
    offers: {
      '@type': 'Offer',
      url: `https://ngc-website.com/products/${product.sku}`,
      priceCurrency: 'USD',
      price: product.originalPrice || product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 30 days from now
    },
    ...(product.originalPrice && {
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: product.originalPrice,
        priceCurrency: 'USD',
      },
    }),
  };
}

// Product List Schema Generator
export function generateProductListSchema(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateProductSchema(product),
    })),
  };
}

// Article Schema Generator
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author || 'NGC Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NGC',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ngc-website.com/assets/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

// Blog Posting Schema Generator
export function generateBlogPostingSchema(post: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: {
      '@type': 'Person',
      name: post.author || 'NGC Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'NGC',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ngc-website.com/assets/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
    ...(post.keywords && { keywords: post.keywords.join(', ') }),
  };
}

// FAQ Schema Generator
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
