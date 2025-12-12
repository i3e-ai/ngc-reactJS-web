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
} from './product-listing';
import './product-listing.css';

const ProductListing: React.FC = () => {
  //Single state object contains all component state

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (priceTimeoutRef.current) {
        clearTimeout(priceTimeoutRef.current);
      }
    };
  }, []);

  // API INTEGRATION
  const loadMoreProducts = useCallback(async (resetProducts = false) => {
    // Prevent duplicate requests
    if (state.loading) {
      console.log('Already loading, skipping request');
      return;
    }

    console.log('Loading more products...');
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Calculate next page number
      const nextPage = resetProducts ? 1 : state.currentPage + 1;

      console.log(`Fetching page ${nextPage}`);

      // Fetch from API
      const response = await productService.fetchProducts(
        nextPage,
        8, // Load 8 products at a time
        state.filter
      );

      if (response.success && response.data) {
        console.log(` Received ${response.data.products.length} products`);

        // Determine if we should inject a promo block
        // Inject after every 2 pages (16 products)
        const shouldInjectPromo = nextPage % 2 === 0 && response.data.promos.length > 0;

        // Build new products array
        const newProducts = resetProducts
          ? response.data.products
          : [...state.products, ...response.data.products];

        // Inject promo block if needed
        if (shouldInjectPromo) {
          const promoIndex = Math.floor(nextPage / 2) - 1;
          const promo = response.data.promos[promoIndex % response.data.promos.length];

          // Create truly unique ID using timestamp to avoid any collision
          const uniquePromoId = `promo-${nextPage}-${Date.now()}`;

          // Add promo as a special "product" with type marker and unique ID
          newProducts.push({
            ...promo,
            id: uniquePromoId,
            type: 'promo'
          } as Product & PromoBlock & { type: 'promo' });

          console.log(`Injected promo block with ID: ${uniquePromoId}`);
        }

        // Update state
        setState(prev => ({
          ...prev,
          products: newProducts,
          currentPage: nextPage,
          hasMore: response.pagination?.hasNext || false,
          totalProducts: response.pagination?.totalItems || 0,
          loading: false
        }));
      } else {
        // Handle API error
        console.error('API returned error:', response.message);
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.message || 'Failed to load products'
        }));
      }
    } catch (error) {
      // Handle network error
      console.error('Network error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Network error occurred'
      }));
    }
  }, [state.currentPage, state.loading, state.filter, state.products]);


  /**
   * Event Handlers
   * Handle quantity change for a product
   * Updates the selectedQuantities map in state
   */
  const handleQuantityChange = useCallback((productId: string, quantity: number) => {
    setState(prev => ({
      ...prev,
      selectedQuantities: {
        ...prev.selectedQuantities,
        [productId]: Math.max(1, quantity) // Minimum quantity is 1
      }
    }));
  }, []);

  /**
   * Handle add to cart button click
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
    // In production, you would call:
    // cartService.addItem(product, quantity);
    alert(`✅ Added ${quantity}x ${product.sales_category_title} to cart!\n\nPrice: $${product.price.toFixed(2)}\nTotal: $${(product.price * quantity).toFixed(2)}`);

  }, [state.selectedQuantities]);

  /** Retry loading after error Resets state and tries again from page 1 */
  const handleRetry = useCallback(() => {
    console.log('🔄 Retrying...');
    setState(prev => ({
      ...prev,
      currentPage: 0,
      error: null
    }));
    loadMoreProducts(true);
  }, [loadMoreProducts]);

  /*Load initial products on component mount */
  useEffect(() => {
    console.log('🚀 Component mounted, loading initial products');
    loadMoreProducts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount

  //Handle Filter Changes
  const handleCategoryChange = useCallback((category: string) => {
    console.log(`Filter Changed : ${category}`);
    setState(prev => {
      const newState = {
        ...prev,
        filter: { ...prev.filter, category },
        products: [],
        currentPage: 0,
        loading: true
      };
      // Reload Products with new filters using updated state
      setTimeout(() => {
        productService.fetchProducts(1, 8, newState.filter).then(response => {
          if (response.success && response.data) {
            setState(current => ({
              ...current,
              products: response.data!.products,
              currentPage: 1,
              hasMore: response.pagination?.hasNext || false,
              totalProducts: response.pagination?.totalItems || 0,
              loading: false
            }));
          }
        });
      }, 0);
      return newState;
    });
  }, []);

  const handlePriceRangeChange = useCallback((minPrice: number, maxPrice: number) => {
    // Clear any existing timeout to prevent race conditions
    if (priceTimeoutRef.current) {
      clearTimeout(priceTimeoutRef.current);
    }

    setState(prev => {
      const newState = {
        ...prev,
        filter: { ...prev.filter, minPrice, maxPrice },
        products: [],
        currentPage: 0,
        loading: true
      };
      priceTimeoutRef.current = setTimeout(() => {
        productService.fetchProducts(1, 8, newState.filter).then(response => {
          if (response.success && response.data) {
            setState(current => ({
              ...current,
              products: response.data!.products,
              currentPage: 1,
              hasMore: response.pagination?.hasNext || false,
              totalProducts: response.pagination?.totalItems || 0,
              loading: false
            }));
          }
        });
      }, 300);
      return newState;
    });
  }, []);

  const handleStockFilter = useCallback((inStockOnly: boolean) => {
    setState(prev => {
      const newState = {
        ...prev,
        filter: { ...prev.filter, inStockOnly },
        products: [],
        currentPage: 0,
        loading: true
      };
      setTimeout(() => {
        productService.fetchProducts(1, 8, newState.filter).then(response => {
          if (response.success && response.data) {
            setState(current => ({
              ...current,
              products: response.data!.products,
              currentPage: 1,
              hasMore: response.pagination?.hasNext || false,
              totalProducts: response.pagination?.totalItems || 0,
              loading: false
            }));
          }
        });
      }, 0);
      return newState;
    });
  }, []);


  /**
   * Determine if an item is a promo block
   * Promo blocks are injected as special products with type='promo'
   */
  const isPromoBlock = (item: Product | (PromoBlock & { type: 'promo' })): item is PromoBlock & { type: 'promo' } => {
    return 'type' in item && item.type === 'promo';
  };

  return (
    <div className="product-listing">
      {/* ===== FILTER PANEL ===== */}
      <aside className="product-listing__filters" aria-label="Product filters">
        <div className="filter-group">
          <h4>Category</h4>
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
          <h2 className="filter-heading">Price Range: ${state.filter.minPrice || 0} - ${state.filter.maxPrice || 1000}</h2>

          <div style={{ marginBottom: '0.5rem' }}>
            {/* Label */}
            <label style={{ fontSize: '0.85rem', color: 'var(--plp-text-muted)' }}>
              Min: {state.filter.minPrice || 0}
            </label>

            {/* CONTAINER FOR SLIDER LOGIC */}
            <div className="slider-container">

              {/* 1. VISUAL TRACKS (Background & Fill) */}
              <div className="slider-track-bg" />
              <div
                className="slider-track-fill"
                style={{
                  left: `${((state.filter.minPrice || 0) / 1000) * 100}%`,
                  width: `${(((state.filter.maxPrice || 1000) - (state.filter.minPrice || 0)) / 1000) * 100}%`
                }}
              />

              {/* 2. INPUTS (Invisible Functionality) */}
              <input
                type='range'
                min="0"
                max="1000"
                value={state.filter.minPrice || 0}
                onChange={(e) => {
                  const newMin = parseInt(e.target.value);
                  const currentMax = state.filter.maxPrice || 1000;
                  // Prevent crossing
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
                  // Prevent crossing
                  if (newMax <= currentMin) return;
                  handlePriceRangeChange(currentMin, newMax);
                }}
                className='thumb thumb--right'
              />
            </div>

            <div className='price-range-label'>
              <span>0</span>
              <span>1000</span>
            </div>
          </div>
        </div>


        <div className="filter-group">
          <h2 className="filter-heading">Availability</h2>
          <div className="filter-option">
            <input
              type="checkbox"
              id="in-stock"
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
          {/* Render products and promo blocks */}
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
              onClick={() => loadMoreProducts(false)}
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
            <p>You&apos;ve viewed all {state.totalProducts} products</p>
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
 * SubComponents
 * ProductCard Component
 * Renders a single product card with image, badges, price, and controls
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
      {/* Product Image */}
      <div className="product-card__image">
        <Image src={product.image} alt={product.sales_category_title} width={400} height={300} loading="lazy" />

        {/* Badges */}
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

      {/* Card Body */}
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

      {/* Card Footer */}
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
 * Renders promotional banner that spans 2 grid columns
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
 * Renders loading skeleton cards with shimmer animation
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

// Export the component
export { ProductListing };
export default ProductListing;
