
import React, { useState } from 'react';
import { Product } from '../contexts/StoreContext';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  layout?: string;
}

const ProductGrid = ({ products, layout = 'grid' }: ProductGridProps) => {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  const nextSlide = () => {
    setCurrentCarouselIndex((prev) => 
      prev === products.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentCarouselIndex((prev) => 
      prev === 0 ? products.length - 1 : prev - 1
    );
  };

  // Ensure we have products
  if (!products || products.length === 0) {
    return <div className="text-center py-6">No products available</div>;
  }

  const gridLayoutClass = layout === 'list' 
    ? "grid grid-cols-1 gap-6" 
    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";

  return (
    <div className={`${gridLayoutClass} animate-fade-in`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} layout={layout} />
      ))}
    </div>
  );
};

export default ProductGrid;
