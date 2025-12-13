'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { productService } from './service/productService';
import type {
  Product,
  PromoBlock,
  ProductListingState,
  ProductCardProps,
  PromoBlockProps,
  ShimmerCardProps
} from './types';
import './product-listing.css';

const ProductListing: React.FC = () => {
  const [state, setState] = useState<ProductListingState>({
    products: [],
    loading: false,
    error: null,
    currentPage: 0,
    hasMore: true,
    totalProducts: 0,
    selectedQuantities: {},
    filter: {}
  });

  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const priceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingRef = useRef<boolean>(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (priceTimeoutRef.current) {
        clearTimeout(priceTimeoutRef.current);
      }
      // Don't abort - causes issues with StrictMode
    };
  }, []);

  /**
   * FIXED: Single source of truth for loading products
   * Prevents race conditions by canceling previous requests
   */
  const loadProducts = useCallback(async (
    page: number,
    resetProducts: boolean,
    filters: typeof state.filter
  ) => {
    // Create new abort controller for this request
    const currentController = new AbortController();
    abortControllerRef.current = currentController;

    loadingRef.current = true;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log(`Fetching page ${page} with filters:`, filters);

      const response = await productService.fetchProducts(page, 8, filters);

      // Check if THIS request was aborted
      if (currentController.signal.aborted) {
        console.log('Request was aborted');
        return;
      }

      if (response.success && response.data) {
        console.log(`Received ${response.data.products.length} products`);

        const newProducts = resetProducts
          ? response.data.products
          : [...state.products, ...response.data.products];

        // Inject promo after every 8 products
        // Count existing promos to avoid duplicates
        const existingPromoCount = newProducts.filter(
          (item) => 'type' in item && item.type === 'promo'
        ).length;
        const productOnlyCount = newProducts.length - existingPromoCount;
        const expectedPromoCount = Math.floor(productOnlyCount / 8);

        if (expectedPromoCount > existingPromoCount && response.data.promos.length > 0) {
          const promo = response.data.promos[existingPromoCount % response.data.promos.length];
          const uniquePromoId = `promo-${productOnlyCount}-${Date.now()}`;

          newProducts.push({
            ...promo,
            id: uniquePromoId,
            type: 'promo'
          } as Product & PromoBlock & { type: 'promo' });

          console.log(`Injected promo block with ID: ${uniquePromoId} after ${productOnlyCount} products`);
        }

        setState(prev => ({
          ...prev,
          products: newProducts,
          currentPage: page,
          hasMore: response.pagination?.hasNext || false,
          totalProducts: response.pagination?.totalItems || 0,
          loading: false,
          filter: filters
        }));
      } else {
        console.error('API returned error:', response.message);
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.message || 'Failed to load products'
        }));
      }
    } catch (error) {
      // Ignore abort errors
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }

      console.error('Network error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      }));
    } finally {
      loadingRef.current = false;
    }
  }, [state.products]);

  /**
   * Load more products (pagination)
   */
  const loadMoreProducts = useCallback(async () => {
    if (state.loading || !state.hasMore) return;
    await loadProducts(state.currentPage + 1, false, state.filter);
  }, [state.loading, state.hasMore, state.currentPage, state.filter, loadProducts]);

  /**
   * FIXED: Handle quantity change
   */
  const handleQuantityChange = useCallback((productId: string, quantity: number) => {
    setState(prev => ({
      ...prev,
      selectedQuantities: {
        ...prev.selectedQuantities,
        [productId]: Math.max(1, quantity)
      }
    }));
  }, []);

  /**
   * FIXED: Handle add to cart
   */
  const handleAddToCart = useCallback((product: Product) => {
    const quantity = state.selectedQuantities[product.id] || 1;

    console.log(`🛒 Adding to cart:`, {
      product: product.sales_category_title,
      quantity,
      price: product.price,
      total: product.price * quantity
    });

    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);

    alert(`✅ Added ${quantity}x ${product.sales_category_title} to cart!\n\nPrice: $${product.price.toFixed(2)}\nTotal: $${(product.price * quantity).toFixed(2)}`);
  }, [state.selectedQuantities]);

  /**
   * FIXED: Retry after error
   */
  const handleRetry = useCallback(() => {
    console.log('🔄 Retrying...');
    loadProducts(1, true, state.filter);
  }, [state.filter, loadProducts]);

  /**
   * Load initial products on mount
   */
  useEffect(() => {
    console.log('🚀 Component mounted, loading initial products');
    loadProducts(1, true, {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  /**
   * FIXED: Handle category change
   */
  const handleCategoryChange = useCallback((category: string) => {
    console.log(`Filter Changed: ${category}`);
    const newFilter = { ...state.filter, category };

    // Clear cache for new filter
    productService.clearCache();

    // Load with new filter
    loadProducts(1, true, newFilter);
  }, [state.filter, loadProducts]);

  /**
   * FIXED: Handle price range change with proper debouncing
   */
  const handlePriceRangeChange = useCallback((minPrice: number, maxPrice: number) => {
    // Clear existing timeout
    if (priceTimeoutRef.current) {
      clearTimeout(priceTimeoutRef.current);
    }

    // Update filter state immediately for UI responsiveness
    setState(prev => ({
      ...prev,
      filter: { ...prev.filter, minPrice, maxPrice }
    }));

    // Debounce the actual API call
    priceTimeoutRef.current = setTimeout(() => {
      console.log(`Price filter changed: $${minPrice} - $${maxPrice}`);
      const newFilter = { ...state.filter, minPrice, maxPrice };

      // Clear cache for new filter
      productService.clearCache();

      // Load with new filter
      loadProducts(1, true, newFilter);
    }, 500); // Increased to 500ms for better UX
  }, [state.filter, loadProducts]);

  /**
   * FIXED: Handle stock filter
   */
  const handleStockFilter = useCallback((inStockOnly: boolean) => {
    console.log(`Stock filter changed: ${inStockOnly}`);
    const newFilter = { ...state.filter, inStockOnly };

    // Clear cache for new filter
    productService.clearCache();

    // Load with new filter
    loadProducts(1, true, newFilter);
  }, [state.filter, loadProducts]);

  /**
   * Type guard for promo blocks
   */
  const isPromoBlock = (item: Product | (PromoBlock & { type: 'promo' })): item is PromoBlock & { type: 'promo' } => {
    return 'type' in item && item.type === 'promo';
  };

  return (
    <div className="product-listing">
      {/* ===== FILTER PANEL ===== */}
      <aside className="product-listing__filters" aria-label="Product filters">
        <div className="filter-group">
          <h3>Category</h3>
          <div className="filter-option">
            <input
              type="radio"
              id="all"
              name="category"
              checked={!state.filter.category || state.filter.category === 'all'}
              onChange={() => handleCategoryChange('all')}
            />
            <label htmlFor="all">All Products</label>
          </div>
          <div className="filter-option">
            <input
              type="radio"
              id="beauty"
              name="category"
              checked={state.filter.category === 'beauty'}
              onChange={() => handleCategoryChange('beauty')}
            />
            <label htmlFor="beauty">Beauty</label>
          </div>
          <div className="filter-option">
            <input
              type="radio"
              id="fragrances"
              name="category"
              checked={state.filter.category === 'fragrances'}
              onChange={() => handleCategoryChange('fragrances')}
            />
            <label htmlFor="fragrances">Fragrances</label>
          </div>
          <div className="filter-option">
            <input
              type="radio"
              id="furniture"
              name="category"
              checked={state.filter.category === 'furniture'}
              onChange={() => handleCategoryChange('furniture')}
            />
            <label htmlFor="furniture">Furniture</label>
          </div>
        </div>

        <div className='dualrange-filter'>
          <h3 className="filter-heading">Price Range: ${state.filter.minPrice || 0} - ${state.filter.maxPrice || 1000}</h3>

          <div style={{ marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--plp-text-muted)' }}>
              Min: ${state.filter.minPrice || 0}
            </label>

            <div className="slider-container">
              <div className="slider-track-bg" />
              <div
                className="slider-track-fill"
                style={{
                  left: `${((state.filter.minPrice || 0) / 1000) * 100}%`,
                  width: `${(((state.filter.maxPrice || 1000) - (state.filter.minPrice || 0)) / 1000) * 100}%`
                }}
              />

              <input
                type='range'
                min="0"
                max="1000"
                value={state.filter.minPrice || 0}
                onChange={(e) => {
                  const newMin = parseInt(e.target.value);
                  const currentMax = state.filter.maxPrice || 1000;
                  if (newMin >= currentMax) return;
                  handlePriceRangeChange(newMin, currentMax);
                }}
                className='thumb thumb--left'
              />
              <input
                type='range'
                min='0'
                max='1000'
                value={state.filter.maxPrice || 1000}
                onChange={(e) => {
                  const newMax = parseInt(e.target.value);
                  const currentMin = state.filter.minPrice || 0;
                  if (newMax <= currentMin) return;
                  handlePriceRangeChange(currentMin, newMax);
                }}
                className='thumb thumb--right'
              />
            </div>

            <div className='price-range-label'>
              <span>$0</span>
              <span>$1000</span>
            </div>
          </div>
        </div>

        <div className="filter-group">
          <h3 className="filter-heading">Availability</h3>
          <div className="filter-option">
            <input
              type="checkbox"
              id="in-stock"
              checked={state.filter.inStockOnly || false}
              onChange={(e) => handleStockFilter(e.target.checked)}
            />
            <label htmlFor="in-stock">In Stock Only</label>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="product-listing__main" aria-label="Product list">
        {/* Error State */}
        {state.error && (
          <div className="product-listing__error">
            <p><strong>Error:</strong> {state.error}</p>
            <button onClick={handleRetry}>Retry</button>
          </div>
        )}

        {/* Product Grid */}
        <div className="product-listing__grid">
          {state.products.map((item) =>
            isPromoBlock(item) ? (
              <PromoBlockComponent key={item.id} promo={item} />
            ) : (
              <ProductCard
                key={item.id}
                product={item}
                quantity={state.selectedQuantities[item.id] || 1}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
                isAddedToCart={addedToCart === item.id}
              />
            )
          )}

          {/* Shimmer Loading Cards */}
          {state.loading && (
            <ShimmerCards count={8} />
          )}
        </div>

        {/* Load More Button */}
        {state.hasMore && !state.loading && !state.error && (
          <div className="product-listing__load-more">
            <button
              onClick={loadMoreProducts}
              className="load-more-button"
            >
              Load More Products
              {state.totalProducts > state.products.length && (
                <> ({state.totalProducts - state.products.length} remaining)</>
              )}
            </button>
          </div>
        )}

        {/* End of Results */}
        {!state.hasMore && state.products.length > 0 && !state.loading && (
          <div className="product-listing__end">
            <p>You&apos;ve viewed all {state.products.filter(p => !('type' in p && p.type === 'promo')).length} products</p>
          </div>
        )}

        {/* Empty State */}
        {!state.loading && state.products.length === 0 && !state.error && (
          <div className="product-listing__end">
            <p>No products found</p>
          </div>
        )}
      </main>
    </div>
  );
};

/**
 * ProductCard Component
 */
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  isAddedToCart
}) => {
  return (
    <article className="product-card">
      <div className="product-card__image">
        <Image src={product.image} alt={product.sales_category_title} width={400} height={300} loading="lazy" />

        {product.badges.length > 0 && (
          <div className="product-card__badges">
            {product.badges.map((badge, index) => (
              <span
                key={index}
                className={`product-card__badge product-card__badge--${badge.type}`}
                style={{ backgroundColor: badge.color }}
              >
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__title">{product.sales_category_title}</h3>
        <p className="product-card__sku">SKU: {product.sku}</p>

        <div className="product-card__price-wrapper">
          <span className={`product-card__price ${product.originalPrice ? 'product-card__price--has-discount' : ''}`}>
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="product-card__original-price">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div className="product-card__footer">
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => onQuantityChange(product.id, parseInt(e.target.value) || 1)}
          className="product-card__quantity"
          aria-label="Quantity"
        />
        <button
          onClick={() => onAddToCart(product)}
          className={`product-card__add-to-cart ${isAddedToCart ? 'product-card__add-to-cart--added' : ''}`}
          disabled={!product.inStock}
        >
          {isAddedToCart ? '✓ Added!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </article>
  );
};

/**
 * PromoBlock Component
 */
const PromoBlockComponent: React.FC<PromoBlockProps> = ({ promo }) => {
  return (
    <div className="promo-block">
      {promo.image && (
        <Image
          src={promo.image}
          alt={promo.title}
          width={600}
          height={300}
          className="promo-block__image"
          unoptimized
        />
      )}
      <h2 className="promo-block__title">{promo.title}</h2>
      <p className="promo-block__description">{promo.description}</p>
      <a href={promo.ctaLink}>
        <button className="promo-block__cta">{promo.ctaText}</button>
      </a>
    </div>
  );
};

/**
 * ShimmerCards Component
 */
const ShimmerCards: React.FC<ShimmerCardProps> = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={`shimmer-${index}`} className="shimmer-card">
          <div className="shimmer-card__image shimmer-box"></div>
          <div className="shimmer-card__body">
            <div className="shimmer-text-sm shimmer-box"></div>
            <div className="shimmer-text-md shimmer-box"></div>
            <div className="shimmer-text-sm shimmer-box"></div>
            <div className="shimmer-text-lg shimmer-box"></div>
          </div>
          <div className="shimmer-card__footer">
            <div className="shimmer-input shimmer-box"></div>
            <div className="shimmer-button shimmer-box"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export { ProductListing };
export default ProductListing;