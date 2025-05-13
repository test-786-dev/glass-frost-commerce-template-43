
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllProducts } from '../data/products';
import type { LayoutElement, CustomLayout, CustomTheme } from '../types/layout';

// Export the Product interface so it can be used elsewhere
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  quantity?: number;
  category?: string;
}

// Re-export the types from layout.ts
export type { LayoutElement, CustomLayout, CustomTheme };

// Add wishlistItems to the context state
interface StoreContextType {
  theme: string;
  setTheme: (theme: string) => void;
  landingLayout: string;
  setLandingLayout: (layout: string) => void;
  productLayout: string;
  setProductLayout: (layout: string) => void;
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  isEditMode: boolean;
  setIsEditMode: (isEdit: boolean) => void;
  savedCustomLayouts: CustomLayout[];
  setActiveCustomLayout: (layout: CustomLayout) => void;
  saveCustomLayout: (layout: CustomLayout) => void;
  deleteCustomLayout: (layoutId: string) => void;
  activeCustomLayout: CustomLayout | null;
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Add new properties
  customThemes: CustomTheme[];
  addCustomTheme: (theme: CustomTheme) => void;
  deleteCustomTheme: (themeId: string) => void;
  setActiveTheme: (theme: CustomTheme) => void;
  productViewLayout: LayoutElement[];
  updateProductViewLayout: (layout: LayoutElement[]) => void;
  cartTotal: number;
  customLayout: LayoutElement[];
  updateCustomLayout: (layout: LayoutElement[]) => void;
  addCustomLayout: (name: string, layout: LayoutElement[]) => CustomLayout;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  // Keep existing states
  const [theme, setTheme] = useState('theme-light-frost');
  const [landingLayout, setLandingLayout] = useState('hero-centric');
  const [productLayout, setProductLayout] = useState('grid');
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [savedCustomLayouts, setSavedCustomLayouts] = useState<CustomLayout[]>([]);
  const [activeCustomLayout, setActiveCustomLayout] = useState<CustomLayout | null>(null);
  const [customLayout, setCustomLayout] = useState<LayoutElement[]>([]);
  
  // Add wishlist state
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Add new states
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [productViewLayout, setProductViewLayout] = useState<LayoutElement[]>([]);

  // Load saved states from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('glassshop-theme');
      const savedLandingLayout = localStorage.getItem('glassshop-landing-layout');
      const savedProductLayout = localStorage.getItem('glassshop-product-layout');
      const savedCartItems = localStorage.getItem('glassshop-cart-items');
      const savedCustomLayouts = localStorage.getItem('glassshop-custom-layouts');
      const savedWishlistItems = localStorage.getItem('glassshop-wishlist-items');
      const savedCustomThemes = localStorage.getItem('glassshop-custom-themes');
      const savedProductViewLayout = localStorage.getItem('glassshop-product-view-layout');

      if (savedTheme) setTheme(savedTheme);
      if (savedLandingLayout) setLandingLayout(savedLandingLayout);
      if (savedProductLayout) setProductLayout(savedProductLayout);
      if (savedCartItems) setCartItems(JSON.parse(savedCartItems));
      if (savedCustomLayouts) setSavedCustomLayouts(JSON.parse(savedCustomLayouts));
      if (savedWishlistItems) setWishlistItems(JSON.parse(savedWishlistItems));
      if (savedCustomThemes) setCustomThemes(JSON.parse(savedCustomThemes));
      if (savedProductViewLayout) setProductViewLayout(JSON.parse(savedProductViewLayout));
    } catch (error) {
      console.error('Error loading from localStorage', error);
    }
  }, []);

  // Save states to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('glassshop-theme', theme);
      localStorage.setItem('glassshop-landing-layout', landingLayout);
      localStorage.setItem('glassshop-product-layout', productLayout);
      localStorage.setItem('glassshop-cart-items', JSON.stringify(cartItems));
      localStorage.setItem('glassshop-custom-layouts', JSON.stringify(savedCustomLayouts));
      localStorage.setItem('glassshop-wishlist-items', JSON.stringify(wishlistItems));
      localStorage.setItem('glassshop-custom-themes', JSON.stringify(customThemes));
      localStorage.setItem('glassshop-product-view-layout', JSON.stringify(productViewLayout));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [theme, landingLayout, productLayout, cartItems, savedCustomLayouts, wishlistItems, customThemes, productViewLayout]);

  // Keep existing cart functions
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Add wishlist functions
  const addToWishlist = (product: Product) => {
    setWishlistItems(prev => {
      const isInWishlist = prev.some(item => item.id === product.id);
      
      if (isInWishlist) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Add new functions
  const addCustomTheme = (theme: CustomTheme) => {
    setCustomThemes(prev => [...prev, theme]);
  };

  const deleteCustomTheme = (themeId: string) => {
    setCustomThemes(prev => prev.filter(theme => theme.id !== themeId));
  };

  const setActiveTheme = (theme: CustomTheme) => {
    // Implementation would depend on how you want to use active themes
    console.log("Setting active theme:", theme);
    // For example, could update the theme state
    setTheme(theme.name);
  };

  const updateProductViewLayout = (layout: LayoutElement[]) => {
    setProductViewLayout(layout);
  };

  const updateCustomLayout = (layout: LayoutElement[]) => {
    setCustomLayout(layout);
  };

  const addCustomLayout = (name: string, layout: LayoutElement[]): CustomLayout => {
    const newLayout: CustomLayout = {
      id: Date.now().toString(),
      name: name,
      sections: layout,
      elements: layout, // For compatibility
      createdAt: new Date().toISOString()
    };
    
    setSavedCustomLayouts(prev => [...prev, newLayout]);
    return newLayout;
  };

  // Keep existing layout functions
  const saveCustomLayout = (layout: CustomLayout) => {
    const updatedLayout = {
      ...layout,
      id: layout.id || Date.now().toString(),
      timestamp: Date.now()
    };
    
    setSavedCustomLayouts(prev => {
      // If this layout already exists (has an id), replace it
      if (layout.id) {
        return prev.map(l => l.id === layout.id ? updatedLayout : l);
      }
      // Otherwise add as new
      return [...prev, updatedLayout];
    });
    
    setActiveCustomLayout(updatedLayout);
  };

  const deleteCustomLayout = (layoutId: string) => {
    setSavedCustomLayouts(prev => prev.filter(layout => layout.id !== layoutId));
    
    // If the active layout is being deleted, clear it
    if (activeCustomLayout?.id === layoutId) {
      setActiveCustomLayout(null);
      setLandingLayout('hero-centric'); // Reset to default
    }
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);

  const value = {
    theme,
    setTheme,
    landingLayout,
    setLandingLayout,
    productLayout,
    setProductLayout,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    isEditMode,
    setIsEditMode,
    savedCustomLayouts,
    saveCustomLayout,
    deleteCustomLayout,
    activeCustomLayout,
    setActiveCustomLayout,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    // Add new properties to the value object
    customThemes,
    addCustomTheme,
    deleteCustomTheme,
    setActiveTheme,
    productViewLayout,
    updateProductViewLayout,
    cartTotal,
    customLayout,
    updateCustomLayout,
    addCustomLayout
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
