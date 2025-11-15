"use client";

import Image from 'next/image';
import './product-display.css';

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


const ProductDisplay: React.FC = () => {
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
    <div className="product">
      {productsData.map((product) => {
        const productId = generateProductId(product.title);

        return (
          <div key={productId} className="product__card">
            <div className="product__image-wrapper">
              <Image
                src={product.image}
                alt={product.title}
                width={500}
                height={500}
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
              />
            </div>
            <div className="product__details">
              <h2 className="product__title">{product.title}</h2>
              <h3 className="product__price">{product.price}</h3>
              <button
                className="product__button"
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

export default ProductDisplay;