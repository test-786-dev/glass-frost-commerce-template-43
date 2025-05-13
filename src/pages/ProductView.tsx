
import React, { useState } from 'react';
import { useStore } from '../contexts/StoreContext';
import type { LayoutElement } from '../types/layout';
import { Button } from "@/components/ui/button";
import { Plus, Move, Trash, Save, Edit } from 'lucide-react';
import { getFeaturedProducts } from '@/data/products';
import ProductGrid from '../components/ProductGrid';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProductView = () => {
  const { productViewLayout, updateProductViewLayout, isEditMode, setIsEditMode } = useStore();
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [newElementType, setNewElementType] = useState<LayoutElement['type']>('products');
  const [newElementContent, setNewElementContent] = useState('');
  const [newElementSize, setNewElementSize] = useState<LayoutElement['size']>('full');
  const [newElementBackground, setNewElementBackground] = useState('bg-transparent');
  const [savedProductLayouts, setSavedProductLayouts] = useState<Array<{id: string, name: string, layout: LayoutElement[]}>>(() => {
    const saved = localStorage.getItem('savedProductLayouts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const products = getFeaturedProducts();

  // If productViewLayout is empty, initialize with a default layout
  React.useEffect(() => {
    if (productViewLayout.length === 0) {
      updateProductViewLayout([
        {
          id: generateId(),
          type: 'hero',
          content: 'Our Products',
          order: 0,
          size: 'full',
          background: 'bg-gradient-to-r from-primary/20 to-secondary/20'
        },
        {
          id: generateId(),
          type: 'products',
          order: 1,
          size: 'full'
        }
      ]);
    }
  }, []);

  // Add a console log to debug the productViewLayout changes
  React.useEffect(() => {
    console.log("ProductViewLayout updated:", productViewLayout);
  }, [productViewLayout]);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    
    const newLayout = [...productViewLayout];
    const draggedItemContent = newLayout[draggedItem];
    
    // Remove the dragged item
    newLayout.splice(draggedItem, 1);
    // Insert it at the new position
    newLayout.splice(index, 0, draggedItemContent);
    
    // Update the order property for all items
    newLayout.forEach((item, idx) => {
      item.order = idx;
    });
    
    updateProductViewLayout(newLayout);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const addNewElement = () => {
    const newElement: LayoutElement = {
      id: generateId(),
      type: newElementType,
      order: productViewLayout.length,
      size: newElementSize,
    };

    if (newElementType === 'text' || newElementType === 'hero') {
      newElement.content = newElementContent;
    }

    if (newElementBackground) {
      newElement.background = newElementBackground;
    }

    updateProductViewLayout([...productViewLayout, newElement]);
    setShowAddDialog(false);
    resetNewElementForm();
    toast({
      title: "Element added",
      description: "New element has been added to your product view layout",
    });
  };

  const removeElement = (id: string) => {
    const newLayout = productViewLayout.filter(item => item.id !== id);
    // Update order after removal
    newLayout.forEach((item, idx) => {
      item.order = idx;
    });
    updateProductViewLayout(newLayout);
    toast({
      title: "Element removed",
      description: "Element has been removed from your layout",
    });
  };

  const resetNewElementForm = () => {
    setNewElementType('products');
    setNewElementContent('');
    setNewElementSize('full');
    setNewElementBackground('bg-transparent');
  };

  const saveLayout = () => {
    if (!layoutName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your layout",
        variant: "destructive"
      });
      return;
    }
    
    const newLayout = {
      id: generateId(),
      name: layoutName,
      layout: [...productViewLayout]
    };
    
    const updatedLayouts = [...savedProductLayouts, newLayout];
    setSavedProductLayouts(updatedLayouts);
    localStorage.setItem('savedProductLayouts', JSON.stringify(updatedLayouts));
    
    setLayoutName('');
    setShowSaveDialog(false);
    setIsEditMode(false);
    
    toast({
      title: "Layout saved",
      description: `"${layoutName}" has been saved to your layouts`,
    });
  };

  const loadLayout = (layout: LayoutElement[]) => {
    console.log("Loading layout:", layout);
    updateProductViewLayout([...layout]); // Create a new array to ensure state update
    setIsEditMode(false);
    
    toast({
      title: "Layout loaded",
      description: "Selected layout has been loaded",
    });
  };

  const deleteLayout = (id: string) => {
    const updatedLayouts = savedProductLayouts.filter(layout => layout.id !== id);
    setSavedProductLayouts(updatedLayouts);
    localStorage.setItem('savedProductLayouts', JSON.stringify(updatedLayouts));
    
    toast({
      title: "Layout deleted",
      description: "Layout has been deleted",
    });
  };

  const renderElement = (element: LayoutElement) => {
    const sizeClasses = {
      small: 'max-w-md',
      medium: 'max-w-2xl',
      large: 'max-w-4xl',
      full: 'w-full'
    };

    const baseClasses = `mb-8 p-6 rounded-2xl ${element.background || ''} ${sizeClasses[element.size || 'medium']} mx-auto`;

    switch (element.type) {
      case 'hero':
        return (
          <div className={`${baseClasses} glass text-center py-20`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{element.content}</h1>
            <Button size="lg">Shop Now</Button>
          </div>
        );
      case 'text':
        return (
          <div className={`${baseClasses} text-center`}>
            <p className="text-lg">{element.content}</p>
          </div>
        );
      case 'products':
        return (
          <div className={`${baseClasses}`}>
            <h2 className="text-2xl font-bold mb-6 text-center">Browse Our Collection</h2>
            <ProductGrid products={products} />
          </div>
        );
      case 'banner':
        return (
          <div className={`${baseClasses} glass bg-gradient-to-r from-primary/20 to-secondary/20 text-center py-10`}>
            <h2 className="text-2xl font-bold mb-2">Special Offer</h2>
            <p>Use code SHOP20 for 20% off your first purchase</p>
          </div>
        );
      default:
        return null;
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      setShowSaveDialog(true);
    } else {
      setIsEditMode(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Layout management */}
      <div className="flex justify-between items-center mb-6">
        {savedProductLayouts.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Saved Layouts</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-popover">
              <DropdownMenuLabel>Saved Product Layouts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {savedProductLayouts.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  className="flex justify-between items-center"
                  onClick={() => loadLayout(item.layout)}
                >
                  <span>{item.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLayout(item.id);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className={`${savedProductLayouts.length === 0 ? 'ml-auto' : ''}`}>
          <Button
            variant={isEditMode ? "default" : "outline"}
            onClick={toggleEditMode}
          >
            {isEditMode ? (
              <>
                <Save size={18} className="mr-2" /> Save Layout
              </>
            ) : (
              <>
                <Edit size={18} className="mr-2" /> Edit Layout
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Layout builder */}
      {isEditMode && (
        <div className="glass p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Product View Layout Builder</h2>
          <p className="mb-4">Drag elements to reorder. Click the + button to add new elements.</p>
          <Button onClick={() => setShowAddDialog(true)} className="mb-6">
            <Plus size={18} className="mr-2" /> Add Element
          </Button>
        </div>
      )}

      {/* Product view layout elements */}
      <div className="layout-container">
        {productViewLayout.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Your product view layout is empty</h2>
            <p className="mb-6">Start by enabling edit mode and adding elements to your layout</p>
            <Button onClick={() => setIsEditMode(true)}>Start Building</Button>
          </div>
        ) : (
          productViewLayout.map((element, index) => (
            <div 
              key={element.id}
              draggable={isEditMode}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative ${isEditMode ? 'border-2 border-dashed border-primary/50 p-2 rounded-lg' : ''}`}
            >
              {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-2 glass p-1 rounded-md z-10">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="cursor-move"
                  >
                    <Move size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeElement(element.id)}
                    className="text-destructive"
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              )}
              {renderElement(element)}
            </div>
          ))
        )}
      </div>

      {/* Add new element dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Element</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Type</label>
              <Select
                value={newElementType}
                onValueChange={(value) => setNewElementType(value as LayoutElement['type'])}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select element type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">Hero Section</SelectItem>
                  <SelectItem value="text">Text Block</SelectItem>
                  <SelectItem value="products">Products Grid</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(newElementType === 'hero' || newElementType === 'text') && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Content</label>
                <input
                  value={newElementContent}
                  onChange={(e) => setNewElementContent(e.target.value)}
                  className="col-span-3 flex h-10 rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Size</label>
              <Select
                value={newElementSize}
                onValueChange={(value) => setNewElementSize(value as LayoutElement['size'])}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select element size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="full">Full Width</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Background</label>
              <Select
                value={newElementBackground}
                onValueChange={setNewElementBackground}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select background style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-transparent">None</SelectItem>
                  <SelectItem value="glass">Glass Effect</SelectItem>
                  <SelectItem value="bg-primary/10">Primary Light</SelectItem>
                  <SelectItem value="bg-secondary/10">Secondary Light</SelectItem>
                  <SelectItem value="bg-gradient-to-r from-primary/20 to-secondary/20">Gradient 1</SelectItem>
                  <SelectItem value="bg-gradient-to-r from-blue-400/20 to-purple-500/20">Gradient 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={addNewElement}>
              Add Element
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save layout dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Your Layout</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="layout-name" className="text-right text-sm font-medium">Name</label>
              <input
                id="layout-name"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                className="col-span-3 flex h-10 rounded-md border border-input bg-background px-3 py-2"
                placeholder="My Product Layout"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setShowSaveDialog(false);
              setIsEditMode(false);
            }}>
              Don't Save
            </Button>
            <Button type="button" onClick={saveLayout}>
              Save Layout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductView;
