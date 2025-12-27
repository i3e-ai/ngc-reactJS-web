import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// @ts-expect-error - TS doesn't allow .tsx extension in imports but it's needed for Jest
import ProductListing from '../product-listing.tsx';
import { productService } from '../service/productService';
import type { Product } from '../types';

// Mock the product service to control API responses in tests
jest.mock('../service/productService', () => ({
  productService: {
    fetchProducts: jest.fn(),
    clearCache: jest.fn(),
  },
}));

const mockProductService = productService as jest.Mocked<typeof productService>;

describe('ProductListing Component', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      sales_category_title: 'Test Product 1',
      category: 'beauty',
      sku: 'TEST-001',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png',
      inStock: true,
      quantity: 1,
      description: 'Test product description',
      badges: [{ label: 'New', type: 'new' as const, color: '#007bff' }],
    },
    {
      id: '2',
      sales_category_title: 'Test Product 2',
      category: 'fragrances',
      sku: 'TEST-002',
      price: 49.99,
      originalPrice: undefined,
      image: 'https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/1.png',
      inStock: true,
      quantity: 1,
      description: 'Test product description',
      badges: [],
    },
  ];

  const mockSuccessResponse = {
    success: true,
    data: {
      products: mockProducts,
      promos: [],
    },
    pagination: {
      currentPage: 1,
      totalPages: 2,
      hasNext: true,
      hasPrev: false,
      totalItems: 10,
      itemsPerPage: 8,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockProductService.fetchProducts.mockResolvedValue(mockSuccessResponse);
  });

  describe('Initial Rendering', () => {
    it('renders the product listing component', async () => {
      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });
    });

    it('loads products on mount', async () => {
      render(<ProductListing />);

      await waitFor(() => {
        expect(mockProductService.fetchProducts).toHaveBeenCalledWith(1, 8, {});
      });
    });

    it('displays loading shimmer cards initially', () => {
      mockProductService.fetchProducts.mockImplementation(
        () => new Promise(() => { }) // Never resolves
      );

      render(<ProductListing />);

      const shimmerCards = document.querySelectorAll('.shimmer-card');
      expect(shimmerCards.length).toBeGreaterThan(0);
    });
  });

  describe('Product Display', () => {
    it('renders product cards with correct information', async () => {
      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      });

      expect(screen.getByText('SKU: TEST-001')).toBeInTheDocument();
      expect(screen.getByText('SKU: TEST-002')).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText('$49.99')).toBeInTheDocument();
    });

    it('displays product badges', async () => {
      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('New')).toBeInTheDocument();
      });
    });

    it('shows original price when discounted', async () => {
      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('$39.99')).toBeInTheDocument();
      });
    });
  });

  describe('Category Filters', () => {
    it('renders all category filter options', () => {
      render(<ProductListing />);

      expect(screen.getByLabelText('All Products')).toBeInTheDocument();
      expect(screen.getByLabelText('Beauty')).toBeInTheDocument();
      expect(screen.getByLabelText('Fragrances')).toBeInTheDocument();
      expect(screen.getByLabelText('Furniture')).toBeInTheDocument();
    });

    it('filters products by category when radio button is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });

      const beautyFilter = screen.getByLabelText('Beauty');
      await user.click(beautyFilter);

      await waitFor(() => {
        expect(mockProductService.fetchProducts).toHaveBeenCalledWith(
          1,
          8,
          expect.objectContaining({ category: 'beauty' })
        );
      });
    });

    it('has "All Products" selected by default', () => {
      render(<ProductListing />);

      const allProductsRadio = screen.getByLabelText('All Products') as HTMLInputElement;
      expect(allProductsRadio.checked).toBe(true);
    });
  });

  describe('Price Range Filter', () => {
    it('renders price range sliders', () => {
      render(<ProductListing />);

      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2); // Min and max sliders
    });

    it('displays current price range', () => {
      render(<ProductListing />);

      expect(screen.getByText(/Price Range: \$0 - \$1000/i)).toBeInTheDocument();
    });

    it('updates price filter when slider is moved', async () => {
      jest.useFakeTimers();
      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });

      const sliders = screen.getAllByRole('slider');
      const minSlider = sliders[0];

      fireEvent.change(minSlider, { target: { value: '100' } });

      // Fast-forward debounce timer
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(mockProductService.fetchProducts).toHaveBeenCalledWith(
          1,
          8,
          expect.objectContaining({ minPrice: 100 })
        );
      });

      jest.useRealTimers();
    });

    it('debounces price filter changes', async () => {
      jest.useFakeTimers();
      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });

      const initialCallCount = mockProductService.fetchProducts.mock.calls.length;

      const sliders = screen.getAllByRole('slider');
      const minSlider = sliders[0];

      // Rapid changes
      fireEvent.change(minSlider, { target: { value: '100' } });
      fireEvent.change(minSlider, { target: { value: '200' } });
      fireEvent.change(minSlider, { target: { value: '300' } });

      // Should not call service yet
      expect(mockProductService.fetchProducts).toHaveBeenCalledTimes(initialCallCount);

      // Fast-forward debounce timer
      jest.advanceTimersByTime(300);

      // Should call service only once with final value
      await waitFor(() => {
        expect(mockProductService.fetchProducts).toHaveBeenCalledTimes(initialCallCount + 1);
        expect(mockProductService.fetchProducts).toHaveBeenLastCalledWith(
          1,
          8,
          expect.objectContaining({ minPrice: 300 })
        );
      });

      jest.useRealTimers();
    });
  });

  describe('Stock Availability Filter', () => {
    it('renders stock availability checkbox', () => {
      render(<ProductListing />);

      expect(screen.getByLabelText('In Stock Only')).toBeInTheDocument();
    });

    it('filters products by stock availability', async () => {
      const user = userEvent.setup();
      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });

      const stockCheckbox = screen.getByLabelText('In Stock Only');
      await user.click(stockCheckbox);

      await waitFor(() => {
        expect(mockProductService.fetchProducts).toHaveBeenCalledWith(
          1,
          8,
          expect.objectContaining({ inStockOnly: true })
        );
      });
    });
  });

  describe('Add to Cart Functionality', () => {
    it('renders add to cart buttons', async () => {
      render(<ProductListing />);

      await waitFor(() => {
        const addToCartButtons = screen.getAllByText('Add to Cart');
        expect(addToCartButtons.length).toBeGreaterThan(0);
      });
    });

    it('updates button text when product is added to cart', async () => {
      const user = userEvent.setup();
      // Mock window.alert
      window.alert = jest.fn();

      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });

      const addToCartButtons = screen.getAllByText('Add to Cart');
      await user.click(addToCartButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('✓ Added!')).toBeInTheDocument();
      });
    });

    it('allows quantity selection before adding to cart', async () => {
      const user = userEvent.setup();
      window.alert = jest.fn();

      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });

      const quantityInputs = screen.getAllByRole('spinbutton', { name: /quantity/i });
      // Clear input by selecting all and deleting
      await user.tripleClick(quantityInputs[0]);
      await user.keyboard('3');

      expect(quantityInputs[0]).toHaveValue(3);
    });

    it('disables add to cart button for out of stock products', async () => {
      const outOfStockProduct = {
        ...mockProducts[0],
        inStock: false,
      };

      mockProductService.fetchProducts.mockResolvedValue({
        success: true,
        data: {
          products: [outOfStockProduct],
          promos: [],
        },
        pagination: {
          currentPage: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
          totalItems: 1,
          itemsPerPage: 8,
        },
      });

      render(<ProductListing />);

      await waitFor(() => {
        const button = screen.getByText('Out of Stock');
        expect(button).toBeDisabled();
      });
    });
  });

  describe('Load More Functionality', () => {
    it('renders load more button when more products available', async () => {
      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText(/Load More Products/i)).toBeInTheDocument();
      });
    });

    it('loads more products when button is clicked', async () => {
      const user = userEvent.setup();
      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });

      const loadMoreButton = screen.getByText(/Load More Products/i);
      await user.click(loadMoreButton);

      await waitFor(() => {
        expect(mockProductService.fetchProducts).toHaveBeenCalledWith(2, 8, {});
      });
    });

    it('hides load more button when no more products', async () => {
      mockProductService.fetchProducts.mockResolvedValue({
        ...mockSuccessResponse,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
          totalItems: 2,
          itemsPerPage: 8,
        },
      });

      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });

      expect(screen.queryByText(/Load More Products/i)).not.toBeInTheDocument();
      expect(screen.getByText(/You've viewed all 2 products/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when API fails', async () => {
      mockProductService.fetchProducts.mockResolvedValue({
        success: false,
        data: null,
        message: 'Failed to fetch products',
        pagination: undefined,
      });

      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch products/i)).toBeInTheDocument();
      });
    });

    it('shows retry button on error', async () => {
      mockProductService.fetchProducts.mockResolvedValue({
        success: false,
        data: null,
        message: 'Network error',
        pagination: undefined,
      });

      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });
    });

    it('retries loading products when retry button is clicked', async () => {
      const user = userEvent.setup();

      // First call fails
      mockProductService.fetchProducts.mockResolvedValueOnce({
        success: false,
        data: null,
        message: 'Network error',
        pagination: undefined,
      });

      // Second call succeeds
      mockProductService.fetchProducts.mockResolvedValueOnce(mockSuccessResponse);

      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('Retry')).toBeInTheDocument();
      });

      const retryButton = screen.getByText('Retry');
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('displays empty state when no products found', async () => {
      mockProductService.fetchProducts.mockResolvedValue({
        success: true,
        data: {
          products: [],
          promos: [],
        },
        pagination: {
          currentPage: 1,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
          totalItems: 0,
          itemsPerPage: 8,
        },
      });

      render(<ProductListing />);

      await waitFor(() => {
        expect(screen.getByText('No products found')).toBeInTheDocument();
      });
    });
  });
});
