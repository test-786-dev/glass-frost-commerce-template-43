
import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Trash, ShoppingCart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useStore();

  const handleRemove = (productId) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from wishlist",
      description: "The item has been removed from your wishlist.",
    });
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8">
            Browse our shop and add items you love to your wishlist
          </p>
          <Button asChild size="lg">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {wishlistItems.map(product => (
            <div key={product.id} className="flex flex-col md:flex-row p-4 border rounded-lg glass-card">
              <div className="md:w-1/4 mb-4 md:mb-0">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 md:h-32 object-cover rounded-md"
                  />
                </Link>
              </div>
              <div className="md:w-2/4 md:px-6 flex flex-col justify-center">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-xl font-bold hover:text-primary transition-colors">{product.name}</h3>
                </Link>
                <p className="text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                <p className="font-semibold mt-2">${product.price.toFixed(2)}</p>
              </div>
              <div className="md:w-1/4 flex flex-row md:flex-col justify-end md:justify-center items-center gap-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm" onClick={() => handleAddToCart(product)}>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleRemove(product.id)}>
                  <Trash className="mr-2 h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
