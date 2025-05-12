
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { getFeaturedProducts } from '@/data/products';
import ProductCard from '../ProductCard';

const HeroCentricLayout = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden mb-16">
        <img 
          src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
          alt="Modern home decor" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-lg">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">Elevate Your Space</h1>
              <p className="text-lg mb-8">
                Discover our collection of premium home decor and tech accessories designed for modern living.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link to="/shop">
                    <ShoppingBag className="mr-2 h-5 w-5" /> Shop Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link to="/shop">Explore Collections</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-6 mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link to="/shop">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="glass mb-16 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Be the first to know about new arrivals, special offers and exclusive events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" 
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroCentricLayout;
