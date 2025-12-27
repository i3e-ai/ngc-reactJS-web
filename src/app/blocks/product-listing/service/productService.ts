import {
  ApiResponse,
  ProductFilters,
  Product,
  Badge,
  PromoBlock,
} from '../types';

// API Configuration
const API_CONFIG = {
  BASE_URL: '/api/komatsu-proxy', // Use Next.js API route proxy
  DEFAULT_UID: 'MTQ2OA==',
  ITEMS_PER_PAGE: 8,
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 10000,
};

// Komatsu API Response Types
interface KomatsuProduct {
  shortDescription: string;
  sku: string;
  aemUrl: string;
  imageUrl: string;
}

interface KomatsuCategory {
  uid: string;
  name: string;
}

interface KomatsuPageInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

interface KomatsuApiResponse {
  products?: KomatsuProduct[];
  categories?: KomatsuCategory[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  childCategories?: any[];
  pageInfo?: KomatsuPageInfo;
  totalCount?: number;
  parentCategoryName?: string;
}

class ProductService {
  private static instance: ProductService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cache: Map<string, any> = new Map();
  private categoryCache: KomatsuCategory[] | null = null;

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Transform Komatsu API product to our internal Product format
   */
  private transformProduct(apiProduct: KomatsuProduct): Product {
    const badges: Badge[] = [];

    // Check if it's a placeholder image
    const isPlaceholder = apiProduct.imageUrl.includes('/placeholder/');

    // Add badge for placeholder images
    if (isPlaceholder) {
      badges.push({
        type: 'limited',
        label: 'No Image',
        color: '#9E9E9E',
      });
    }

    // Construct full image URL if it's a relative path
    let fullImageUrl = apiProduct.imageUrl;
    if (!fullImageUrl.startsWith('http')) {
      fullImageUrl = `https://www.komatsu.com${apiProduct.imageUrl}`;
    }

    // Extract category from aemUrl (e.g., "parts/cab/guarding/...")
    const urlParts = apiProduct.aemUrl.split('/');
    const category = urlParts.length > 2 ? urlParts[2] : 'parts';

    return {
      id: apiProduct.sku,
      image: fullImageUrl,
      badges,
      category: category,
      sales_category_title: apiProduct.shortDescription,
      sku: apiProduct.sku,
      price: 0,
      quantity: 1,
      inStock: true,
      description: apiProduct.shortDescription,
      rating: 0,
      hasRealImage: isPlaceholder, // Add flag for filtering
    };
  }

  /**
   * Fetch products from Komatsu API with pagination and filters
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

      // Build API URL with query parameters
      const params = new URLSearchParams();

      // Add category filter (uid) if provided
      if (filters?.category && filters.category !== 'all') {
        const categoryUid = await this.getCategoryUid(filters.category);
        params.append('uid', categoryUid || API_CONFIG.DEFAULT_UID);
      } else {
        params.append('uid', API_CONFIG.DEFAULT_UID);
      }

      params.append('c', page.toString());
      params.append('z', limit.toString());
      params.append('s', 'a'); // sort order

      // Add search query if provided
      if (filters?.searchQuery) {
        params.append('q', filters.searchQuery);
      }

      const url = `${API_CONFIG.BASE_URL}?${params.toString()}`;
      console.log('Fetching from API:', url);

      const response = await this.fetchWithRetry(url);
      const data: KomatsuApiResponse = await response.json();

      console.log('API Response:', data);

      // Handle both array and object response formats
      let productsArray: KomatsuProduct[] = [];
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      }

      console.log(`Found ${productsArray.length} products in response`);

      // Transform products
      const products = productsArray.map((p) => this.transformProduct(p));

      // Apply client-side filters if needed
      const filteredProducts = this.applyClientSideFilters(products, filters);

      // Mock promo blocks
      const promos: PromoBlock[] = this.getMockPromos();

      // Build response with pagination info
      const result: ApiResponse<{ products: Product[]; promos: PromoBlock[] }> =
        {
          data: {
            products: filteredProducts,
            promos,
          },
          success: true,
          pagination: {
            currentPage: data.pageInfo?.currentPage || page,
            totalPages: data.pageInfo?.totalPages || 1,
            totalItems: data.totalCount || filteredProducts.length,
            itemsPerPage: data.pageInfo?.pageSize || limit,
            hasNext: data.pageInfo
              ? data.pageInfo.currentPage < data.pageInfo.totalPages
              : false,
            hasPrev: data.pageInfo ? data.pageInfo.currentPage > 1 : page > 1,
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
   * Apply client-side filters (category, stock)
   */
  private applyClientSideFilters(
    products: Product[],
    filters?: ProductFilters
  ): Product[] {
    if (!filters) return products;

    return products.filter((product) => {
      // Stock filter
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }

      return true;
    });
  }

  /**
   * Get category UID by name
   */
  private async getCategoryUid(categoryName: string): Promise<string | null> {
    try {
      const categories = await this.fetchCategories();
      const category = categories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      return category?.uid || null;
    } catch (error) {
      console.error('Failed to get category UID:', error);
      return null;
    }
  }

  /**
   * Get mock promotional blocks
   */
  private getMockPromos(): PromoBlock[] {
    return [
      {
        id: 'promo-1',
        title: 'Komatsu Parts Special',
        description: 'Genuine OEM parts for your equipment',
        image: 'https://placehold.co/600x300/F7931E/ffffff?text=Komatsu+Parts',
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
   * Fetch available categories from Komatsu API
   */
  async fetchCategories(): Promise<KomatsuCategory[]> {
    try {
      if (this.categoryCache) {
        return this.categoryCache;
      }

      // Fetch from main endpoint to get categories
      const params = new URLSearchParams();
      params.append('uid', API_CONFIG.DEFAULT_UID);
      params.append('c', '1');
      params.append('z', '1');
      params.append('s', 'a');

      const url = `${API_CONFIG.BASE_URL}?${params.toString()}`;
      const response = await this.fetchWithRetry(url);
      const data: KomatsuApiResponse = await response.json();

      console.log('Categories response:', data);

      this.categoryCache = data.categories || [];
      return this.categoryCache;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  }

  clearCache(): void {
    this.cache.clear();
    this.categoryCache = null;
  }
}

export const productService = ProductService.getInstance();
export type { KomatsuCategory, KomatsuProduct, KomatsuApiResponse };
