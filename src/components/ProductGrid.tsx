
import React, { useState } from 'react';
import { Product, useStore } from '../contexts/StoreContext';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const { productLayout } = useStore();
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

  if (productLayout === 'list') {
    return (
      <div className="space-y-4 animate-fade-in">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} layout="list" />
        ))}
      </div>
    );
  }

  if (productLayout === 'masonry') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
        {products.map((product) => (
          <div key={product.id} className="masonry-item">
            <ProductCard product={product} layout="masonry" />
          </div>
        ))}
      </div>
    );
  }

  if (productLayout === 'carousel') {
    return (
      <div className="relative w-full animate-fade-in">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-300 ease-in-out"
               style={{ transform: `translateX(-${currentCarouselIndex * 100}%)` }}>
            {products.map((product) => (
              <div key={product.id} className="w-full flex-shrink-0 px-4">
                <ProductCard product={product} layout="carousel" />
              </div>
            ))}
          </div>
        </div>
        <button 
          onClick={prevSlide} 
          className="absolute top-1/2 left-0 -translate-y-1/2 bg-background/70 p-2 rounded-r-full"
        >
          <ChevronLeft />
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute top-1/2 right-0 -translate-y-1/2 bg-background/70 p-2 rounded-l-full"
        >
          <ChevronRight />
        </button>
        <div className="flex justify-center mt-4 gap-2">
          {products.map((_, index) => (
            <button 
              key={index} 
              className={`w-2 h-2 rounded-full ${index === currentCarouselIndex ? 'bg-primary' : 'bg-muted'}`}
              onClick={() => setCurrentCarouselIndex(index)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default grid layout
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} layout="grid" />
      ))}
    </div>
  );
};

export default ProductGrid;
