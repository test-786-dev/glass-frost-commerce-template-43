
import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Menu, ChevronDown, Home, ShoppingBag, Palette, Plus, LayoutTemplate, Edit, Trash } from 'lucide-react';

const Navbar = () => {
  const {
    theme,
    setTheme,
    landingLayout,
    setLandingLayout,
    productLayout,
    setProductLayout,
    cartItems,
    isEditMode,
    savedCustomLayouts,
    setActiveCustomLayout,
    deleteCustomLayout
  } = useStore();

  return (
    <nav className="sticky top-0 z-50 w-full glass-navbar px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          GlassShop
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-1 hover:text-primary transition-colors">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/shop" className="flex items-center space-x-1 hover:text-primary transition-colors">
            <ShoppingBag size={18} />
            <span>Shop</span>
          </Link>
          <Link to="/product-view" className="flex items-center space-x-1 hover:text-primary transition-colors">
            <LayoutTemplate size={18} />
            <span>Product View</span>
          </Link>

          {/* Landing Layout Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1">
                <span>Layout</span>
                <ChevronDown size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 glass-card">
              <DropdownMenuLabel>Built-in Layouts</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setLandingLayout('hero-centric')} 
                className={landingLayout === 'hero-centric' ? 'bg-primary/20' : ''}>
                Hero-Centric
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLandingLayout('product-showcase')}
                className={landingLayout === 'product-showcase' ? 'bg-primary/20' : ''}>
                Product Showcase
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLandingLayout('minimalist')}
                className={landingLayout === 'minimalist' ? 'bg-primary/20' : ''}>
                Minimalist
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLandingLayout('story-driven')}
                className={landingLayout === 'story-driven' ? 'bg-primary/20' : ''}>
                Story-Driven
              </DropdownMenuItem>
              
              {savedCustomLayouts.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Custom Layouts</DropdownMenuLabel>
                  {savedCustomLayouts.map(layout => (
                    <DropdownMenuItem 
                      key={layout.id} 
                      className="flex justify-between items-center"
                      onClick={() => {
                        setActiveCustomLayout(layout);
                        setLandingLayout('custom');
                      }}
                    >
                      <span>{layout.name}</span>
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 p-0 mr-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCustomLayout(layout);
                            setLandingLayout('custom');
                            // Set to edit mode
                            setIsEditMode(true); 
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomLayout(layout.id);
                          }}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  setLandingLayout('custom');
                  setIsEditMode(true);
                  // Clear active custom layout to start fresh
                  setActiveCustomLayout(null);
                }}
                className="flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Create New Layout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Product Layout Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1">
                <span>View</span>
                <ChevronDown size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 glass-card">
              <DropdownMenuItem onClick={() => setProductLayout('grid')}
                className={productLayout === 'grid' ? 'bg-primary/20' : ''}>
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProductLayout('list')}
                className={productLayout === 'list' ? 'bg-primary/20' : ''}>
                List View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProductLayout('masonry')}
                className={productLayout === 'masonry' ? 'bg-primary/20' : ''}>
                Masonry View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setProductLayout('carousel')}
                className={productLayout === 'carousel' ? 'bg-primary/20' : ''}>
                Carousel View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1">
                <Palette size={18} />
                <span>Theme</span>
                <ChevronDown size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 glass-card">
              <DropdownMenuLabel>Built-in Themes</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setTheme('theme-light-frost')}
                className={theme === 'theme-light-frost' ? 'bg-primary/20' : ''}>
                Light Frost
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('theme-dark-nebula')}
                className={theme === 'theme-dark-nebula' ? 'bg-primary/20' : ''}>
                Dark Nebula
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('theme-twilight-glow')}
                className={theme === 'theme-twilight-glow' ? 'bg-primary/20' : ''}>
                Twilight Glow
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/theme-customizer" className="flex items-center">
                  <Plus size={16} className="mr-2" />
                  Custom Themes
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Show indicator when in edit mode - ONLY for product view page */}
          {isEditMode && window.location.pathname === '/product-view' && (
            <span className="bg-primary text-white px-2 py-1 rounded text-xs">
              Edit Mode
            </span>
          )}
        </div>

        {/* Cart and Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Link to="/checkout" className="relative">
            <ShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <Button variant="ghost" className="md:hidden">
            <Menu size={24} />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
