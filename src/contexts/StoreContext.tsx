
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'theme-light-frost' | 'theme-dark-nebula' | 'theme-twilight-glow';
type LandingLayout = 'hero-centric' | 'product-showcase' | 'minimalist' | 'story-driven' | 'custom';
type ProductLayout = 'grid' | 'list' | 'masonry' | 'carousel';

export interface LayoutElement {
  id: string;
  type: 'hero' | 'products' | 'banner' | 'text' | 'image' | 'spacer' | 'grid' | 'marquee' | 'bento' | 'carousel';
  content?: string;
  imageUrl?: string;
  order: number;
  size?: 'small' | 'medium' | 'large' | 'full';
  background?: string;
  items?: Array<{id: string, title?: string, imageUrl?: string, content?: string}>;
  columns?: number;
}

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
  customLayout: LayoutElement[];
  updateCustomLayout: (layout: LayoutElement[]) => void;
  isEditMode: boolean;
  setIsEditMode: (isEditing: boolean) => void;
  productViewLayout: LayoutElement[];
  updateProductViewLayout: (layout: LayoutElement[]) => void;
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
  const [customLayout, setCustomLayout] = useState<LayoutElement[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [productViewLayout, setProductViewLayout] = useState<LayoutElement[]>([]);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLandingLayout = localStorage.getItem('landingLayout') as LandingLayout;
    const savedProductLayout = localStorage.getItem('productLayout') as ProductLayout;
    const savedCart = localStorage.getItem('cartItems');
    const savedCustomLayout = localStorage.getItem('customLayout');
    const savedProductViewLayout = localStorage.getItem('productViewLayout');

    if (savedTheme) setThemeState(savedTheme);
    if (savedLandingLayout) setLandingLayoutState(savedLandingLayout);
    if (savedProductLayout) setProductLayoutState(savedProductLayout);
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedCustomLayout) setCustomLayout(JSON.parse(savedCustomLayout));
    if (savedProductViewLayout) setProductViewLayout(JSON.parse(savedProductViewLayout));

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

  const updateCustomLayout = (newLayout: LayoutElement[]) => {
    setCustomLayout(newLayout);
    localStorage.setItem('customLayout', JSON.stringify(newLayout));
  };

  const updateProductViewLayout = (newLayout: LayoutElement[]) => {
    setProductViewLayout(newLayout);
    localStorage.setItem('productViewLayout', JSON.stringify(newLayout));
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
        cartTotal,
        customLayout,
        updateCustomLayout,
        isEditMode,
        setIsEditMode,
        productViewLayout,
        updateProductViewLayout
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
