
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getAllProducts } from '@/data/products';
import ProductCard from '../ProductCard';

const ProductShowcaseLayout = () => {
  const allProducts = getAllProducts();
  // Filter products by category, assuming we've added categories to the products
  const electronicProducts = allProducts.filter(p => p.category === 'Electronics' || p.category === 'Eyewear').slice(0, 4);
  const homeDecorProducts = allProducts.filter(p => p.category === 'Luxury' || p.category === 'Sports').slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Mini Hero Section */}
      <section className="relative h-[40vh] overflow-hidden mb-16">
        <img 
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
          alt="Modern technology" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-lg">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">Discover What's New</h1>
              <p className="text-lg mb-6">
                Explore our latest arrivals in tech and home accessories.
              </p>
              <Button size="lg" asChild>
                <Link to="/shop">Shop Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Electronics Category */}
      <section className="container mx-auto px-6 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Electronics</h2>
          <Link to="/shop" className="flex items-center text-primary hover:underline">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {electronicProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Banner */}
      <section className="glass mb-16 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                alt="Featured product" 
                className="rounded-lg max-w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-4">Elevate Your Workspace</h2>
              <p className="mb-6">
                Discover our premium collection of desk accessories and tech gear designed to enhance productivity and style.
              </p>
              <Button asChild>
                <Link to="/shop">Shop Workspace Collection</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Home Decor Category */}
      <section className="container mx-auto px-6 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Home Decor</h2>
          <Link to="/shop" className="flex items-center text-primary hover:underline">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {homeDecorProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductShowcaseLayout;
