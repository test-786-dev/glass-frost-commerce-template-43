
import React from 'react';
import { useStore } from '../contexts/StoreContext';
import HeroCentricLayout from '../components/landing/HeroCentricLayout';
import ProductShowcaseLayout from '../components/landing/ProductShowcaseLayout';
import MinimalistLayout from '../components/landing/MinimalistLayout';
import StoryDrivenLayout from '../components/landing/StoryDrivenLayout';
import CustomLayout from '../components/landing/CustomLayout';

const Index = () => {
  const { landingLayout } = useStore();

  // Render different layout based on user preference
  const renderLayout = () => {
    switch (landingLayout) {
      case 'hero-centric':
        return <HeroCentricLayout />;
      case 'product-showcase':
        return <ProductShowcaseLayout />;
      case 'minimalist':
        return <MinimalistLayout />;
      case 'story-driven':
        return <StoryDrivenLayout />;
      case 'custom':
        return <CustomLayout />;
      default:
        return <HeroCentricLayout />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderLayout()}
    </div>
  );
};

export default Index;
