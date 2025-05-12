
import React, { useState } from 'react';
import { useStore, LayoutElement } from '../../contexts/StoreContext';
import { Button } from "@/components/ui/button";
import { Plus, Move, Trash, Save } from 'lucide-react';
import { getFeaturedProducts } from '@/data/products';
import ProductCard from '../ProductCard';
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

const CustomLayout = () => {
  const { customLayout, updateCustomLayout, isEditMode, setIsEditMode } = useStore();
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newElementType, setNewElementType] = useState<LayoutElement['type']>('hero');
  const [newElementContent, setNewElementContent] = useState('');
  const [newElementImage, setNewElementImage] = useState('');
  const [newElementSize, setNewElementSize] = useState<LayoutElement['size']>('medium');
  const [newElementBackground, setNewElementBackground] = useState('');
  
  const products = getFeaturedProducts().slice(0, 4);

  // If customLayout is empty, initialize with a default layout
  React.useEffect(() => {
    if (customLayout.length === 0 && isEditMode) {
      updateCustomLayout([
        {
          id: generateId(),
          type: 'hero',
          content: 'Welcome to Your Custom Layout',
          order: 0,
          size: 'full',
          background: 'bg-gradient-to-r from-primary/20 to-secondary/20'
        },
        {
          id: generateId(),
          type: 'text',
          content: 'Start customizing by adding new elements or editing existing ones.',
          order: 1,
          size: 'medium'
        }
      ]);
    }
  }, [isEditMode]);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    
    const newLayout = [...customLayout];
    const draggedItemContent = newLayout[draggedItem];
    
    // Remove the dragged item
    newLayout.splice(draggedItem, 1);
    // Insert it at the new position
    newLayout.splice(index, 0, draggedItemContent);
    
    // Update the order property for all items
    newLayout.forEach((item, idx) => {
      item.order = idx;
    });
    
    updateCustomLayout(newLayout);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const addNewElement = () => {
    const newElement: LayoutElement = {
      id: generateId(),
      type: newElementType,
      order: customLayout.length,
      size: newElementSize,
    };

    if (newElementType === 'text' || newElementType === 'hero') {
      newElement.content = newElementContent;
    }

    if (newElementType === 'image') {
      newElement.imageUrl = newElementImage;
    }

    if (newElementBackground) {
      newElement.background = newElementBackground;
    }

    updateCustomLayout([...customLayout, newElement]);
    setShowAddDialog(false);
    resetNewElementForm();
    toast({
      title: "Element added",
      description: "New element has been added to your layout",
    });
  };

  const removeElement = (id: string) => {
    const newLayout = customLayout.filter(item => item.id !== id);
    // Update order after removal
    newLayout.forEach((item, idx) => {
      item.order = idx;
    });
    updateCustomLayout(newLayout);
    toast({
      title: "Element removed",
      description: "Element has been removed from your layout",
    });
  };

  const resetNewElementForm = () => {
    setNewElementType('hero');
    setNewElementContent('');
    setNewElementImage('');
    setNewElementSize('medium');
    setNewElementBackground('');
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
            <Button size="lg">Explore Now</Button>
          </div>
        );
      case 'text':
        return (
          <div className={`${baseClasses} text-center`}>
            <p className="text-lg">{element.content}</p>
          </div>
        );
      case 'image':
        return (
          <div className={`${baseClasses} overflow-hidden`}>
            <img 
              src={element.imageUrl || 'https://images.unsplash.com/photo-1551434678-e076c223a692'} 
              alt="Custom image" 
              className="w-full h-auto rounded-xl"
            />
          </div>
        );
      case 'products':
        return (
          <div className={`${baseClasses}`}>
            <h2 className="text-2xl font-bold mb-6 text-center">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      case 'banner':
        return (
          <div className={`${baseClasses} glass bg-gradient-to-r from-primary/20 to-secondary/20 text-center py-10`}>
            <h2 className="text-2xl font-bold mb-2">Special Offer</h2>
            <p>Use code CUSTOM20 for 20% off your first purchase</p>
          </div>
        );
      case 'spacer':
        return <div className={`h-16 ${baseClasses}`}></div>;
      default:
        return null;
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      toast({
        title: "Changes saved",
        description: "Your custom layout has been saved",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Edit mode toggle */}
      <div className="flex justify-end mb-6">
        <Button
          variant={isEditMode ? "default" : "outline"}
          onClick={toggleEditMode}
          className="mb-4"
        >
          {isEditMode ? (
            <>
              <Save size={18} className="mr-2" /> Save Layout
            </>
          ) : (
            "Edit Layout"
          )}
        </Button>
      </div>

      {/* Layout builder */}
      {isEditMode && (
        <div className="glass p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Layout Builder</h2>
          <p className="mb-4">Drag elements to reorder. Click the + button to add new elements.</p>
          <Button onClick={() => setShowAddDialog(true)} className="mb-6">
            <Plus size={18} className="mr-2" /> Add Element
          </Button>
        </div>
      )}

      {/* Custom layout elements */}
      <div className="layout-container">
        {customLayout.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Your custom layout is empty</h2>
            <p className="mb-6">Start by enabling edit mode and adding elements to your layout</p>
            <Button onClick={() => setIsEditMode(true)}>Start Building</Button>
          </div>
        ) : (
          customLayout.map((element, index) => (
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
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="products">Products Grid</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                  <SelectItem value="spacer">Spacer</SelectItem>
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

            {newElementType === 'image' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Image URL</label>
                <input
                  value={newElementImage}
                  onChange={(e) => setNewElementImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
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
                  <SelectItem value="">None</SelectItem>
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
    </div>
  );
};

export default CustomLayout;
