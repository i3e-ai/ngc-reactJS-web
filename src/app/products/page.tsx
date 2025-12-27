"use client";

import ProductListing from "../blocks/product-listing/product-listing";
import './products.css';

// Note: For client components, metadata should be set in parent layout or via next/head
// Consider creating a server component wrapper if static metadata is needed

const ProductPage: React.FC = () => {
  return <ProductListing />;
};

export default ProductPage;