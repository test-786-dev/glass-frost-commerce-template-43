
import React from 'react';
import { Product, useStore } from '../contexts/StoreContext';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list' | 'masonry' | 'carousel';
}

const ProductCard = ({ product, layout = 'grid' }: ProductCardProps) => {
  const { addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  // Different layouts for the product card
  if (layout === 'list') {
    return (
      <div className="glass-card w-full flex gap-4 p-4 rounded-lg transition-transform hover:scale-[1.01] animate-fade-in mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-cover w-32 h-32 rounded-md"
        />
        <div className="flex flex-col justify-between flex-grow">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            <div className="mt-2 text-sm text-muted-foreground">{product.category}</div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold">${product.price.toFixed(2)}</span>
            <Button onClick={handleAddToCart} size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'masonry') {
    // Generate random heights for masonry layout
    const randomHeight = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    const heightClass = `h-${randomHeight * 48}`;

    return (
      <div className={`glass-card rounded-lg overflow-hidden relative transition-transform hover:scale-[1.02] animate-fade-in`}>
        <img 
          src={product.image} 
          alt={product.name} 
          className={`object-cover w-full ${heightClass}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <h3 className="font-medium text-white">{product.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold text-white">${product.price.toFixed(2)}</span>
            <Button variant="secondary" size="sm" onClick={handleAddToCart}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'carousel') {
    return (
      <div className="glass-card rounded-lg overflow-hidden flex flex-col h-full transition-transform hover:scale-[1.02] animate-fade-in">
        <div className="relative h-64">
          <img 
            src={product.image} 
            alt={product.name} 
            className="object-cover w-full h-full"
          />
          <div className="absolute top-2 right-2">
            <Button size="icon" variant="secondary" onClick={handleAddToCart} className="rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 flex-grow">{product.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-muted-foreground">{product.category}</span>
            <span className="font-bold">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }

  // Default grid layout
  return (
    <div className="glass-card rounded-lg overflow-hidden flex flex-col h-full transition-transform hover:scale-[1.02] animate-fade-in">
      <img 
        src={product.image} 
        alt={product.name} 
        className="object-cover w-full h-48"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium">{product.name}</h3>
        <div className="text-sm text-muted-foreground mt-1">{product.category}</div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 flex-grow">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <Button onClick={handleAddToCart} size="sm">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
