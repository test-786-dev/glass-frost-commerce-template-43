
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '@/data/products';
import ProductCard from '../ProductCard';

const StoryDrivenLayout = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="animate-fade-in">
      {/* Opening Story Section */}
      <section className="h-screen flex items-center justify-center relative">
        <img 
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
          alt="Our journey" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10 mt-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">Our Journey</h1>
            <p className="text-xl mb-8">
              It started with a simple idea: create products that blend seamlessly with modern life.
            </p>
            <div className="animate-bounce">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Story Chapter 1 */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Chapter 1: The Vision</h2>
            <p className="mb-4">
              In 2018, we set out to create a brand that would redefine how people interact with everyday objects. Our founder, inspired by the minimalist movement, wanted to create products that would not only serve their purpose but also elevate the spaces they inhabit.
            </p>
            <p>
              We believe that the objects we surround ourselves with impact our mood, productivity, and overall well-being. That's why we're committed to thoughtful design and quality craftsmanship.
            </p>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="The vision" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
              alt="The process" 
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-6">Chapter 2: The Process</h2>
            <p className="mb-4">
              Every product in our collection goes through an extensive design and testing process. We work with skilled artisans and use premium materials to ensure that each piece meets our exacting standards.
            </p>
            <p>
              From the initial sketch to the final product, we focus on sustainability, functionality, and timeless design. Our goal is to create items that you'll cherish for years to come.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 glass">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">The Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/shop">Explore All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final Chapter */}
      <section className="py-24 container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">The Future</h2>
        <p className="max-w-2xl mx-auto mb-12 text-xl">
          We're constantly evolving, seeking new materials, techniques, and inspirations. Join us on our journey as we continue to create products that inspire and delight.
        </p>
        <Button size="lg" variant="outline" asChild>
          <Link to="/shop">Be Part of Our Story</Link>
        </Button>
      </section>
    </div>
  );
};

export default StoryDrivenLayout;
