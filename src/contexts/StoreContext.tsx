import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';

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
  savedCustomLayouts: any[];
  setActiveCustomLayout: (layout: any) => void;
  saveCustomLayout: (layout: any) => void;
  deleteCustomLayout: (layoutId: string) => void;
  activeCustomLayout: any;
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  // Keep existing states
  const [theme, setTheme] = useState('theme-light-frost');
  const [landingLayout, setLandingLayout] = useState('hero-centric');
  const [productLayout, setProductLayout] = useState('grid');
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [savedCustomLayouts, setSavedCustomLayouts] = useState<any[]>([]);
  const [activeCustomLayout, setActiveCustomLayout] = useState<any>(null);
  
  // Add wishlist state
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  // Load saved states from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('glassshop-theme');
      const savedLandingLayout = localStorage.getItem('glassshop-landing-layout');
      const savedProductLayout = localStorage.getItem('glassshop-product-layout');
      const savedCartItems = localStorage.getItem('glassshop-cart-items');
      const savedCustomLayouts = localStorage.getItem('glassshop-custom-layouts');
      const savedWishlistItems = localStorage.getItem('glassshop-wishlist-items');

      if (savedTheme) setTheme(savedTheme);
      if (savedLandingLayout) setLandingLayout(savedLandingLayout);
      if (savedProductLayout) setProductLayout(savedProductLayout);
      if (savedCartItems) setCartItems(JSON.parse(savedCartItems));
      if (savedCustomLayouts) setSavedCustomLayouts(JSON.parse(savedCustomLayouts));
      if (savedWishlistItems) setWishlistItems(JSON.parse(savedWishlistItems));
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
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [theme, landingLayout, productLayout, cartItems, savedCustomLayouts, wishlistItems]);

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

  // Keep existing layout functions
  const saveCustomLayout = (layout: any) => {
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
    isInWishlist
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
