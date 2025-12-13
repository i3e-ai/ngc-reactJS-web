import {
  ApiResponse,
  ProductFilters,
  Product,
  Badge,
  PromoBlock,
} from '../product-listing';

// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://dummyjson.com',
  ITEMS_PER_PAGE: 8,
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 10000,
};

// Transform DummyJSON product to our Product type
interface DummyJSONProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface DummyJSONResponse {
  products: DummyJSONProduct[];
  total: number;
  skip: number;
  limit: number;
}

class ProductService {
  private static instance: ProductService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: Map<string, any> = new Map();

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Transform DummyJSON product to our internal Product format
   */
  private transformProduct(apiProduct: DummyJSONProduct): Product {
    const badges: Badge[] = [];

    if (apiProduct.discountPercentage > 0) {
      badges.push({
        type: 'on-sale',
        label: `${Math.round(apiProduct.discountPercentage)}% OFF`,
        color: '#FF5722',
      });
    }

    if (apiProduct.id > 90) {
      badges.push({
        type: 'new',
        label: 'New',
        color: '#4CAF50',
      });
    }

    if (apiProduct.stock < 50) {
      badges.push({
        type: 'limited',
        label: 'Low Stock',
        color: '#FFC107',
      });
    }

    const originalPrice =
      apiProduct.discountPercentage > 0
        ? apiProduct.price / (1 - apiProduct.discountPercentage / 100)
        : undefined;

    return {
      id: `prod-${apiProduct.id}`,
      image: apiProduct.thumbnail,
      badges,
      category: apiProduct.category,
      sales_category_title: apiProduct.title,
      sku: `SKU-${apiProduct.brand?.toUpperCase() || 'PROD'}-${apiProduct.id}`,
      price: apiProduct.price,
      originalPrice,
      quantity: 1,
      inStock: apiProduct.stock > 0,
      description: apiProduct.description,
      rating: apiProduct.rating,
    };
  }

  /**
   * Fetch products from DummyJSON API with pagination
   *
   * FIXED: Now handles client-side filtering correctly by:
   * 1. Fetching more products than needed
   * 2. Applying filters
   * 3. Returning correct pagination based on filtered results
   */
  async fetchProducts(
    page: number = 1,
    limit: number = API_CONFIG.ITEMS_PER_PAGE,
    filters?: ProductFilters
  ): Promise<ApiResponse<{ products: Product[]; promos: PromoBlock[] }>> {
    try {
      const cacheKey = `products-${page}-${limit}-${JSON.stringify(
        filters || {}
      )}`;

      if (this.cache.has(cacheKey)) {
        console.log('Returning cached data');
        return this.cache.get(cacheKey);
      }

      // For client-side filters (price, stock), we need to fetch MORE products
      // to ensure we have enough after filtering
      const hasClientSideFilters =
        filters?.minPrice !== undefined ||
        filters?.maxPrice !== undefined ||
        filters?.inStockOnly;

      // Fetch 3x more products if we have client-side filters
      const fetchLimit = hasClientSideFilters ? limit * 3 : limit;
      const skip = (page - 1) * fetchLimit;

      // Build API URL
      let url = `${API_CONFIG.BASE_URL}/products?limit=${fetchLimit}&skip=${skip}`;

      if (filters?.category && filters.category !== 'all') {
        url = `${API_CONFIG.BASE_URL}/products/category/${filters.category}?limit=${fetchLimit}&skip=${skip}`;
      }

      if (filters?.searchQuery) {
        url = `${API_CONFIG.BASE_URL}/products/search?q=${encodeURIComponent(
          filters.searchQuery
        )}&limit=${fetchLimit}&skip=${skip}`;
      }

      console.log('Fetching from API:', url);

      const response = await this.fetchWithRetry(url);
      const data: DummyJSONResponse = await response.json();

      // Transform products
      const products = data.products.map((p) => this.transformProduct(p));

      // Apply client-side filters
      const filteredProducts = this.applyClientSideFilters(products, filters);

      // Take only the requested limit from filtered results
      const paginatedProducts = filteredProducts.slice(0, limit);

      // Mock promo blocks
      const promos: PromoBlock[] = this.getMockPromos();

      // Calculate correct pagination for filtered results
      const result: ApiResponse<{ products: Product[]; promos: PromoBlock[] }> =
        {
          data: {
            products: paginatedProducts,
            promos,
          },
          success: true,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(filteredProducts.length / limit),
            totalItems: filteredProducts.length,
            itemsPerPage: limit,
            hasNext: filteredProducts.length > limit,
            hasPrev: page > 1,
          },
        };

      // Cache result
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('API Error:', error);

      return {
        data: null,
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to fetch products',
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  /**
   * Apply filters that API doesn't support (price range, stock)
   */
  private applyClientSideFilters(
    products: Product[],
    filters?: ProductFilters
  ): Product[] {
    if (!filters) return products;

    return products.filter((product) => {
      // Price range filter
      if (filters.minPrice !== undefined && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
        return false;
      }

      // Stock filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    });
  }

  /**
   * Get mock promotional blocks
   */
  private getMockPromos(): PromoBlock[] {
    return [
      {
        id: 'promo-1',
        title: 'Black Friday Sale',
        description: 'Up to 50% off on selected items',
        image:
          'https://placehold.co/600x300/FF5722/ffffff?text=Black+Friday+Sale',
        ctaText: 'Shop Now',
        ctaLink: '/sale',
      },
    ];
  }

  /**
   * Fetch with retry logic
   */
  private async fetchWithRetry(url: string, retryCount = 0): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.TIMEOUT
      );

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      if (retryCount < API_CONFIG.RETRY_ATTEMPTS) {
        console.warn(`Retry attempt ${retryCount + 1}`);
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1))
        );
        return this.fetchWithRetry(url, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Fetch available categories from API
   */
  async fetchCategories(): Promise<string[]> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/products/categories`
      );
      const categories: string[] = await response.json();
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const productService = ProductService.getInstance();
