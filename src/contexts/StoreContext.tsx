
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'theme-light-frost' | 'theme-dark-nebula' | 'theme-twilight-glow';
type LandingLayout = 'hero-centric' | 'product-showcase' | 'minimalist' | 'story-driven';
type ProductLayout = 'grid' | 'list' | 'masonry' | 'carousel';

interface StoreContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  landingLayout: LandingLayout;
  setLandingLayout: (layout: LandingLayout) => void;
  productLayout: ProductLayout;
  setProductLayout: (layout: ProductLayout) => void;
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  cartTotal: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage or defaults
  const [theme, setThemeState] = useState<Theme>('theme-light-frost');
  const [landingLayout, setLandingLayoutState] = useState<LandingLayout>('hero-centric');
  const [productLayout, setProductLayoutState] = useState<ProductLayout>('grid');
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLandingLayout = localStorage.getItem('landingLayout') as LandingLayout;
    const savedProductLayout = localStorage.getItem('productLayout') as ProductLayout;
    const savedCart = localStorage.getItem('cartItems');

    if (savedTheme) setThemeState(savedTheme);
    if (savedLandingLayout) setLandingLayoutState(savedLandingLayout);
    if (savedProductLayout) setProductLayoutState(savedProductLayout);
    if (savedCart) setCartItems(JSON.parse(savedCart));

    // Apply the theme to the document
    document.body.className = savedTheme || theme;
  }, []);

  // Calculate cart total whenever cart changes
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    setCartTotal(total);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Setter functions that update localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  const setLandingLayout = (newLayout: LandingLayout) => {
    setLandingLayoutState(newLayout);
    localStorage.setItem('landingLayout', newLayout);
  };

  const setProductLayout = (newLayout: ProductLayout) => {
    setProductLayoutState(newLayout);
    localStorage.setItem('productLayout', newLayout);
  };

  const addToCart = (product: Product) => {
    setCartItems((prev) => [...prev, product]);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        setTheme,
        landingLayout,
        setLandingLayout,
        productLayout,
        setProductLayout,
        cartItems,
        addToCart,
        removeFromCart,
        cartTotal
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
