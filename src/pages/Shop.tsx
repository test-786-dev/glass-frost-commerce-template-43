
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { products } from '@/data/products';
import ProductGrid from '@/components/ProductGrid';
import { Search, Filter, XCircle } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';

const Shop = () => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const { productLayout } = useStore();
  
  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  // Filter products based on search, price, and categories
  React.useEffect(() => {
    let result = products;
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    setFilteredProducts(result);
  }, [searchQuery, priceRange, selectedCategories]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 200]);
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shop All Products</h1>
      
      {/* Search Bar - Mobile & Desktop */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-6">
        <Button onClick={() => setIsMobileFilterOpen(true)} variant="outline" className="w-full">
          <Filter size={18} className="mr-2" /> Filter Products
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <aside className="hidden md:block w-full md:w-64 glass p-6 rounded-lg h-fit">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2">
                <XCircle size={16} className="mr-1" /> Reset
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium mb-4">Price Range</h4>
                <Slider
                  defaultValue={priceRange}
                  min={0}
                  max={200}
                  step={5}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              
              {/* Category Filter */}
              <div>
                <h4 className="font-medium mb-4">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <Checkbox 
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={category} className="ml-2">{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Sidebar */}
        {isMobileFilterOpen && (
          <div className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-fade-in">
            <div className="fixed right-0 top-0 h-full w-3/4 glass-card shadow-xl animate-slide-in">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileFilterOpen(false)}>
                    <XCircle size={20} />
                  </Button>
                </div>
                
                <div className="space-y-6">
                  {/* Price Range Filter */}
                  <div>
                    <h4 className="font-medium mb-4">Price Range</h4>
                    <Slider
                      defaultValue={priceRange}
                      min={0}
                      max={200}
                      step={5}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  
                  {/* Category Filter */}
                  <div>
                    <h4 className="font-medium mb-4">Categories</h4>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category} className="flex items-center">
                          <Checkbox 
                            id={`mobile-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <Label htmlFor={`mobile-${category}`} className="ml-2">{category}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full" 
                      onClick={() => setIsMobileFilterOpen(false)}
                    >
                      Apply Filters
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2" 
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground">
              Showing {filteredProducts.length} products
            </p>
            <div className="text-sm text-muted-foreground">
              View: <span className="font-medium">{productLayout.charAt(0).toUpperCase() + productLayout.slice(1)}</span>
            </div>
          </div>
          
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-12 glass-card rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
              <Button variant="outline" onClick={resetFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
