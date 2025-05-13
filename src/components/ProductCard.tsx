
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: any;
  layout?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { addToCart, addToWishlist, isInWishlist } = useStore();
  
  const isWishlisted = isInWishlist?.(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist`,
    });
  };

  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-shadow duration-300 ${layout === 'list' ? 'flex flex-row' : ''}`}>
      <Link to={`/product/${product.id}`} className={layout === 'list' ? 'flex-shrink-0 w-1/3' : ''}>
        <div className={`relative overflow-hidden ${layout === 'list' ? 'h-full' : 'aspect-square'}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
          
          {/* Quick action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="rounded-full opacity-90 hover:opacity-100"
              onClick={handleAddToWishlist}
            >
              <Heart className={isWishlisted ? "fill-primary text-primary" : ""} size={18} />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold truncate">{product.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="font-bold">${product.price.toFixed(2)}</span>
            <div className="flex items-center text-yellow-500">
              {'★'.repeat(Math.floor(product.rating))}
              <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
            </div>
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0">
        <Button variant="default" className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2" size={16} /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
