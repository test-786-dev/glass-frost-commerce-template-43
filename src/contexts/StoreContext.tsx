
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'theme-light-frost' | 'theme-dark-nebula' | 'theme-twilight-glow' | string;
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

export interface CustomLayout {
  id: string;
  name: string;
  elements: LayoutElement[];
  createdAt: string;
}

export interface CustomTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  createdAt: string;
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
  savedCustomLayouts: CustomLayout[];
  addCustomLayout: (name: string, elements: LayoutElement[]) => void;
  deleteCustomLayout: (id: string) => void;
  setActiveCustomLayout: (layout: CustomLayout) => void;
  activeCustomLayout: CustomLayout | null;
  customThemes: CustomTheme[];
  addCustomTheme: (theme: CustomTheme) => void;
  deleteCustomTheme: (id: string) => void;
  setActiveTheme: (theme: CustomTheme) => void;
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
  const [savedCustomLayouts, setSavedCustomLayouts] = useState<CustomLayout[]>([]);
  const [activeCustomLayout, setActiveCustomLayout] = useState<CustomLayout | null>(null);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);

  // Load preferences from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const savedLandingLayout = localStorage.getItem('landingLayout') as LandingLayout;
    const savedProductLayout = localStorage.getItem('productLayout') as ProductLayout;
    const savedCart = localStorage.getItem('cartItems');
    const savedCustomLayout = localStorage.getItem('customLayout');
    const savedProductViewLayout = localStorage.getItem('productViewLayout');
    const savedCustomLayouts = localStorage.getItem('savedCustomLayouts');
    const savedCustomThemes = localStorage.getItem('customThemes');

    if (savedTheme) setThemeState(savedTheme);
    if (savedLandingLayout) setLandingLayoutState(savedLandingLayout);
    if (savedProductLayout) setProductLayoutState(savedProductLayout);
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedCustomLayout) setCustomLayout(JSON.parse(savedCustomLayout));
    if (savedProductViewLayout) setProductViewLayout(JSON.parse(savedProductViewLayout));
    if (savedCustomLayouts) setSavedCustomLayouts(JSON.parse(savedCustomLayouts));
    if (savedCustomThemes) setCustomThemes(JSON.parse(savedCustomThemes));

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

  // Custom layouts management
  const addCustomLayout = (name: string, elements: LayoutElement[]) => {
    const newLayout: CustomLayout = {
      id: generateId(),
      name,
      elements,
      createdAt: new Date().toISOString(),
    };
    
    const updatedLayouts = [...savedCustomLayouts, newLayout];
    setSavedCustomLayouts(updatedLayouts);
    localStorage.setItem('savedCustomLayouts', JSON.stringify(updatedLayouts));
    
    // Set as active layout
    setActiveCustomLayout(newLayout);
    
    // Update current custom layout
    updateCustomLayout(elements);
    
    return newLayout;
  };

  const deleteCustomLayout = (id: string) => {
    const updatedLayouts = savedCustomLayouts.filter(layout => layout.id !== id);
    setSavedCustomLayouts(updatedLayouts);
    localStorage.setItem('savedCustomLayouts', JSON.stringify(updatedLayouts));
    
    // If active layout is deleted, reset active layout
    if (activeCustomLayout && activeCustomLayout.id === id) {
      setActiveCustomLayout(null);
    }
  };

  // Custom themes management
  const addCustomTheme = (theme: CustomTheme) => {
    const updatedThemes = [...customThemes, theme];
    setCustomThemes(updatedThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedThemes));
  };

  const deleteCustomTheme = (id: string) => {
    const updatedThemes = customThemes.filter(theme => theme.id !== id);
    setCustomThemes(updatedThemes);
    localStorage.setItem('customThemes', JSON.stringify(updatedThemes));
  };

  const setActiveTheme = (theme: CustomTheme) => {
    const cssVars = `
      :root {
        --custom-primary: ${theme.primaryColor};
        --custom-secondary: ${theme.secondaryColor};
        --custom-accent: ${theme.accentColor};
        --custom-background: ${theme.backgroundColor};
        --custom-text: ${theme.textColor};
      }
    `;
    
    // Create or update the style element
    let styleEl = document.getElementById('custom-theme-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-theme-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = cssVars;
    
    // Set custom theme class
    document.body.className = `theme-custom-${theme.id}`;
    setThemeState(`theme-custom-${theme.id}`);
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
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
        updateProductViewLayout,
        savedCustomLayouts,
        addCustomLayout,
        deleteCustomLayout,
        activeCustomLayout,
        setActiveCustomLayout,
        customThemes,
        addCustomTheme,
        deleteCustomTheme,
        setActiveTheme
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
