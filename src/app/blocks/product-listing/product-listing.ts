import { title } from "process";

interface Badge{
  type: 'new' | 'sold' | 'on-sale' | 'limited' | 'best-seller';
  label: string;
  color: string;
}

interface Product{
  id: string;
  image: string;
  badges: Badge[];
  sales_category_title: string;
  sku: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  inStock: boolean;
  featured?: boolean;
}

interface PromoBlock{
  id: string;
  title: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  position: number;
}

export interface ProductFilters{
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  searchQuery?: string;
}

export interface PaginationInfo{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

//API Response Types wraps all api responses with consistent structure
export interface ApiResponse<T>{
  data: T | null;
  success: boolean;
  message?: string;
  pagination?: PaginationInfo;
}

//ProductListingState manages the entire component state
export interface ProductListingState{
  products: Product[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  totalProducts: number;
  selectedQuantites: Record<string, number>;
  filter: ProductFilters;
}

export interface ProductCardProps{
  product: Product;
  quantity: number;
  onQuantityChange: (id: string,  qty: number)=>void;
  onAddToCart: (product: Product)=>void;
}

export interface PromoBlockProps{
  promo: PromoBlock;
}

//Loading skeletion
export interface ShimmerCardProps{
  count?: number;
}