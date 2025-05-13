
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAllProducts } from '@/data/products';
import { Link } from 'react-router-dom';

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 1) {
      const allProducts = getAllProducts();
      const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden md:block">Search products...</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="border-0 focus-visible:ring-0"
              autoFocus
            />
            <Button type="submit" variant="ghost" className="px-3">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="max-h-64 overflow-auto space-y-2">
              {searchResults.map(product => (
                <Link 
                  key={product.id} 
                  to={`/product/${product.id}`}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {searchQuery && searchResults.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No products found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
