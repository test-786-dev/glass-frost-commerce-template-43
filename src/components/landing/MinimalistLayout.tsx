
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts } from '@/data/products';
import ProductCard from '../ProductCard';

const MinimalistLayout = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 3);

  return (
    <div className="animate-fade-in">
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">Design Meets Functionality</h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Curated collection of premium products for the modern lifestyle.
          </p>
          <Button size="lg" asChild>
            <Link to="/shop">Explore Collection</Link>
          </Button>
        </div>

        {/* Featured Image */}
        <div className="mb-24 overflow-hidden rounded-2xl">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            alt="Minimalist interior" 
            className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Featured Products - Single Row */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center">Selected Pieces</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/shop" className="flex items-center">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Quote Section */}
        <div className="glass py-24 px-6 text-center mb-24 rounded-2xl">
          <blockquote className="max-w-2xl mx-auto">
            <p className="text-2xl italic mb-6">
              "Simplicity is the ultimate sophistication."
            </p>
            <footer className="text-muted-foreground">— Leonardo da Vinci</footer>
          </blockquote>
        </div>

        {/* Newsletter */}
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-2xl font-medium mb-4">Stay Updated</h3>
          <p className="mb-6">Subscribe to our newsletter for new arrivals and exclusive offers.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Your email" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" 
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MinimalistLayout;
