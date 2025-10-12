"use client";

import Image from 'next/image';
import './products.css';

// (The Product interface and productsData array remain the same)
interface Product {
  title: string;
  price: string;
  image: string;
}

const productsData: Product[] = [
  {
    title: 'Mobile Phone',
    price: '₹2,499',
    image: '/assets/products/phone.png',
  },
  {
    title: 'Modern Wireless Headphones',
    price: '₹12,999',
    image: '/assets/products/headphone.png',
  },
  {
    title: 'Smart Watch',
    price: '₹4,500',
    image: '/assets/products/smart-watch.png',
  },
];


const ProductPage: React.FC = () => {
  // (Helper functions remain the same)
  const generateProductId = (title: string): string =>
    title.trim().toLowerCase().replace(/\s+/g, '-');

  const onAddToCartClick = (productId: string): void => {
    if (typeof window.handleAddToCart === 'function') {
      window.handleAddToCart(productId);
    } else {
      console.warn('handleAddToCart function is not defined on the window object.');
    }
  };

  return (
    // FIX 1: This is the main container that needs both classes.
    <div className="productdisplay block">
      {productsData.map((product) => {
        const productId = generateProductId(product.title);

        return (
          // This `div` is the card targeted by `.productdisplay.block > div`
          <div key={productId}>
            {/* FIX 2: Corrected class name here */}
            <div className="product-image-wrapper">
              <Image
                src={product.image}
                alt={product.title}
                width={500}
                height={500}
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
              />
            </div>
            {/* These class names correctly match your CSS */}
            <div className="product-details">
              <h2 className="product-title">{product.title}</h2>
              <h3 className="product-price">{product.price}</h3>
              <button
                className="add-to-cart-button"
                onClick={() => onAddToCartClick(productId)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductPage;