declare global {
  interface Window {
    handleAddToCart: (productId: string) => void;
  }
}

export {};
