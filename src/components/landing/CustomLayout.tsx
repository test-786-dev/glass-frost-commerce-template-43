import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { LayoutElement, CustomLayout as CustomLayoutType } from '../../types/layout';
import { Button } from "@/components/ui/button";
import { Plus, Move, Trash, Save, Edit, Grid2x2, LayoutGrid, Image, Type, Ban, SparkleIcon } from 'lucide-react';
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CustomLayout = () => {
  const { 
    customLayout, 
    updateCustomLayout, 
    isEditMode, 
    setIsEditMode,
    savedCustomLayouts,
    addCustomLayout,
    deleteCustomLayout,
    activeCustomLayout,
    setActiveCustomLayout
  } = useStore();
  
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [newElementType, setNewElementType] = useState<LayoutElement['type']>('hero');
  const [newElementContent, setNewElementContent] = useState('');
  const [newElementImage, setNewElementImage] = useState('');
  const [newElementSize, setNewElementSize] = useState<LayoutElement['size']>('medium');
  const [newElementBackground, setNewElementBackground] = useState('bg-transparent');
  const [newElementColumns, setNewElementColumns] = useState(3);
  const [newElementItems, setNewElementItems] = useState<Array<{id: string, title: string, imageUrl: string, content: string}>>([]);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [currentItemTitle, setCurrentItemTitle] = useState('');
  const [currentItemImage, setCurrentItemImage] = useState('');
  const [currentItemContent, setCurrentItemContent] = useState('');
  
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

  const addItemToElement = () => {
    if (!currentItemTitle && !currentItemImage && !currentItemContent) {
      toast({
        title: "Empty item",
        description: "Please add some content to your item",
        variant: "destructive"
      });
      return;
    }
    
    const newItem = {
      id: generateId(),
      title: currentItemTitle,
      imageUrl: currentItemImage,
      content: currentItemContent,
    };
    
    setNewElementItems([...newElementItems, newItem]);
    setCurrentItemTitle('');
    setCurrentItemImage('');
    setCurrentItemContent('');
    setShowItemDialog(false);
    
    toast({
      title: "Item added",
      description: "Item has been added to your element",
    });
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

    if (['grid', 'bento', 'carousel', 'marquee'].includes(newElementType)) {
      if (newElementItems.length === 0) {
        toast({
          title: "No items added",
          description: `Please add at least one item to your ${newElementType} element`,
          variant: "destructive"
        });
        return;
      }
      newElement.items = newElementItems;
    }

    if (newElementType === 'grid') {
      newElement.columns = newElementColumns;
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
    setNewElementBackground('bg-transparent');
    setNewElementItems([]);
    setNewElementColumns(3);
  };

  const handleSaveLayout = () => {
    if (!layoutName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your layout",
        variant: "destructive"
      });
      return;
    }
    
    // Save the current layout
    const newLayout = addCustomLayout(layoutName, [...customLayout]);
    
    setLayoutName('');
    setShowSaveDialog(false);
    setIsEditMode(false);
    
    toast({
      title: "Layout saved",
      description: `"${layoutName}" has been added to your layouts`,
    });
  };

  const handleSelectLayout = (layout: CustomLayoutType) => {
    setActiveCustomLayout(layout);
    updateCustomLayout([...layout.elements]);
    toast({
      title: "Layout loaded",
      description: `"${layout.name}" has been loaded`,
    });
  };

  const handleDeleteLayout = (id: string, layoutName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomLayout(id);
    toast({
      title: "Layout deleted",
      description: `"${layoutName}" has been deleted`,
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
      case 'grid':
        return (
          <div className={`${baseClasses}`}>
            <h2 className="text-2xl font-bold mb-6 text-center">Grid Layout</h2>
            <div className={`grid grid-cols-1 md:grid-cols-${element.columns || 3} gap-6`}>
              {element.items?.map((item) => (
                <div key={item.id} className="glass p-4 rounded-lg">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded-md mb-4" />
                  )}
                  {item.title && <h3 className="text-lg font-medium mb-2">{item.title}</h3>}
                  {item.content && <p className="text-sm text-muted-foreground">{item.content}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      case 'bento':
        return (
          <div className={`${baseClasses}`}>
            <h2 className="text-2xl font-bold mb-6 text-center">Bento Grid</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-4">
              {element.items?.map((item, index) => {
                // Create some variation in the grid layout
                const spanClasses = [
                  "md:col-span-2 md:row-span-2",
                  "",
                  "md:col-span-1 md:row-span-1",
                  "md:col-span-1 md:row-span-2",
                ][index % 4];
                
                return (
                  <div 
                    key={item.id} 
                    className={`glass rounded-xl overflow-hidden relative hover:scale-[1.02] transition-transform ${spanClasses}`}
                  >
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="absolute inset-0 w-full h-full object-cover z-0" 
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 z-10"></div>
                    <div className="relative z-20 p-4 h-full flex flex-col justify-end">
                      {item.title && <h3 className="text-xl font-bold text-white">{item.title}</h3>}
                      {item.content && <p className="text-white/80 mt-2">{item.content}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'marquee':
        return (
          <div className={`${baseClasses} overflow-hidden`}>
            <div className="flex gap-4 animate-marquee">
              {element.items ? (
                // Show the items twice to create infinite loop effect
                [...element.items, ...element.items].map((item, index) => (
                  <div key={item.id + index} className="flex-shrink-0 w-64">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover rounded-md mb-3" />
                    )}
                    {item.title && <h3 className="font-medium">{item.title}</h3>}
                    {item.content && <p className="text-sm text-muted-foreground mt-1">{item.content}</p>}
                  </div>
                ))
              ) : (
                <p>Add items to your marquee</p>
              )}
            </div>
          </div>
        );
      case 'carousel':
        return (
          <div className={`${baseClasses}`}>
            <h2 className="text-2xl font-bold mb-6 text-center">Featured Carousel</h2>
            <Carousel className="w-full">
              <CarouselContent>
                {element.items?.map((item) => (
                  <CarouselItem key={item.id}>
                    <div className="p-1">
                      <div className="glass rounded-xl overflow-hidden">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover" />
                        )}
                        <div className="p-5">
                          {item.title && <h3 className="text-xl font-medium mb-2">{item.title}</h3>}
                          {item.content && <p className="text-muted-foreground">{item.content}</p>}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-4" />
              <CarouselNext className="mr-4" />
            </Carousel>
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
      {/* Layout Management */}
      <div className="flex justify-between items-center mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {activeCustomLayout ? activeCustomLayout.name : "Manage Layouts"}
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Saved Layouts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {savedCustomLayouts.length > 0 ? (
              savedCustomLayouts.map((layout) => (
                <DropdownMenuItem 
                  key={layout.id} 
                  onClick={() => handleSelectLayout(layout)}
                  className="flex justify-between items-center"
                >
                  <span>{layout.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteLayout(layout.id, layout.name, e)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No saved layouts</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

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
                  <SelectItem value="grid">Grid Layout</SelectItem>
                  <SelectItem value="bento">Bento Grid</SelectItem>
                  <SelectItem value="marquee">Marquee Scroll</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
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

            {newElementType === 'grid' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right text-sm font-medium">Columns</label>
                <Select
                  value={newElementColumns.toString()}
                  onValueChange={(value) => setNewElementColumns(parseInt(value))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select number of columns" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Columns</SelectItem>
                    <SelectItem value="3">3 Columns</SelectItem>
                    <SelectItem value="4">4 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {['grid', 'bento', 'carousel', 'marquee'].includes(newElementType) && (
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right text-sm font-medium mt-2">Items</label>
                <div className="col-span-3">
                  <div className="flex flex-col gap-2 mb-2">
                    {newElementItems.length > 0 ? (
                      newElementItems.map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span className="truncate max-w-[200px]">
                            {item.title || item.imageUrl || item.content || `Item ${index + 1}`}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newItems = [...newElementItems];
                              newItems.splice(index, 1);
                              setNewElementItems(newItems);
                            }}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No items added yet</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowItemDialog(true)}
                    className="w-full mt-2"
                  >
                    <Plus size={14} className="mr-2" /> Add Item
                  </Button>
                </div>
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

      {/* Add new item dialog */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Item</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Title</label>
              <input
                value={currentItemTitle}
                onChange={(e) => setCurrentItemTitle(e.target.value)}
                className="col-span-3 flex h-10 rounded-md border border-input bg-background px-3 py-2"
                placeholder="Item title"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Image URL</label>
              <input
                value={currentItemImage}
                onChange={(e) => setCurrentItemImage(e.target.value)}
                className="col-span-3 flex h-10 rounded-md border border-input bg-background px-3 py-2"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Content</label>
              <input
                value={currentItemContent}
                onChange={(e) => setCurrentItemContent(e.target.value)}
                className="col-span-3 flex h-10 rounded-md border border-input bg-background px-3 py-2"
                placeholder="Item description or content"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowItemDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={addItemToElement}>
              Add Item
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
                placeholder="My Custom Layout"
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
            <Button type="button" onClick={handleSaveLayout}>
              Save Layout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomLayout;
