
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useStore } from '../contexts/StoreContext';
import { getProductById } from '../data/products';
import { toast } from '@/hooks/use-toast';
import { Heart, ShoppingCart, ArrowLeft, Star } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, addToWishlist, wishlistItems } = useStore();
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Button asChild>
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const isInWishlist = wishlistItems?.some(item => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleWishlist = () => {
    addToWishlist(product);
    toast({
      title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${product.name} has been ${isInWishlist ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/shop" className="flex items-center mb-6 text-primary hover:underline">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="glass p-6 rounded-xl">
          <AspectRatio ratio={1 / 1} className="bg-muted">
            <img 
              src={product.image} 
              alt={product.name} 
              className="object-cover w-full h-full rounded-lg"
            />
          </AspectRatio>
          <div className="flex mt-4 gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-1/3 aspect-square">
                <img 
                  src={product.image} 
                  alt={`${product.name} view ${i}`}
                  className="object-cover w-full h-full rounded-md border-2 border-transparent hover:border-primary cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center mt-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">({product.reviews} reviews)</span>
          </div>
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          {/* Color Options */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Color</h3>
            <div className="flex space-x-2">
              {['Black', 'Silver', 'Gold'].map(color => {
                const bgColor = color === 'Black' ? 'bg-black' : color === 'Silver' ? 'bg-gray-300' : 'bg-yellow-500';
                return (
                  <div 
                    key={color} 
                    className={`${bgColor} w-8 h-8 rounded-full cursor-pointer border-2 ${color === 'Black' ? 'border-primary' : 'border-transparent'}`}
                    title={color}
                  ></div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <Button onClick={handleAddToCart} size="lg" className="flex-1">
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button 
              onClick={handleWishlist} 
              variant="outline" 
              size="lg"
              className={isInWishlist ? "bg-primary/10" : ""}
            >
              <Heart className={`mr-2 h-4 w-4 ${isInWishlist ? "fill-primary" : ""}`} /> 
              {isInWishlist ? "Saved" : "Save"}
            </Button>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p>{product.description}</p>
                  <p className="mt-4">Designed with precision and crafted with quality materials, our glasses offer both style and durability for everyday wear.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="specifications" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li><strong>Material:</strong> Premium acetate frame</li>
                    <li><strong>Lens:</strong> UV400 protection</li>
                    <li><strong>Size:</strong> Medium fit</li>
                    <li><strong>Weight:</strong> Lightweight (20g)</li>
                    <li><strong>Warranty:</strong> 1 year manufacturer warranty</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="shipping" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p>Free shipping on all orders over $50.</p>
                  <p className="mt-2">Standard delivery: 3-5 business days</p>
                  <p className="mt-2">Express delivery: 1-2 business days (additional $10)</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* This would be populated with related products */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
