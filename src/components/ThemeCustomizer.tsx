
import React, { useState } from 'react';
import { useStore, CustomTheme } from '../contexts/StoreContext';
import { Button } from "@/components/ui/button";
import { Plus, Palette, Trash, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ThemeCustomizer = () => {
  const { customThemes, addCustomTheme, deleteCustomTheme, setActiveTheme } = useStore();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6'); // Default purple
  const [secondaryColor, setSecondaryColor] = useState('#D946EF'); // Default pink
  const [accentColor, setAccentColor] = useState('#0EA5E9'); // Default blue
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF'); // Default white
  const [textColor, setTextColor] = useState('#1A1F2C'); // Default dark

  const handleAddTheme = () => {
    if (!themeName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your theme",
        variant: "destructive"
      });
      return;
    }

    const newTheme: CustomTheme = {
      id: generateId(),
      name: themeName,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
      createdAt: new Date().toISOString()
    };

    addCustomTheme(newTheme);
    resetForm();
    setShowAddDialog(false);

    toast({
      title: "Theme created",
      description: `"${themeName}" has been added to your themes`,
    });
  };

  const handleApplyTheme = (theme: CustomTheme) => {
    setActiveTheme(theme);
    toast({
      title: "Theme applied",
      description: `"${theme.name}" has been applied to your store`,
    });
  };

  const handleDeleteTheme = (id: string, themeName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCustomTheme(id);
    toast({
      title: "Theme deleted",
      description: `"${themeName}" has been deleted`,
    });
  };

  const resetForm = () => {
    setThemeName('');
    setPrimaryColor('#8B5CF6');
    setSecondaryColor('#D946EF');
    setAccentColor('#0EA5E9');
    setBackgroundColor('#FFFFFF');
    setTextColor('#1A1F2C');
  };

  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Theme Customization</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddDialog(true)} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Create Theme</span>
          </Button>

          {customThemes.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Palette size={16} />
                  <span>Apply Theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Custom Themes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {customThemes.map((theme) => (
                  <DropdownMenuItem
                    key={theme.id}
                    onClick={() => handleApplyTheme(theme)}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <span>{theme.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteTheme(theme.id, theme.name, e)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {customThemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customThemes.map(theme => (
            <div key={theme.id} className="glass p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">{theme.name}</h3>
              <div className="flex gap-2 mb-4">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.secondaryColor }}></div>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.accentColor }}></div>
              </div>
              <div className="flex justify-between mt-4">
                <Button variant="outline" size="sm" onClick={() => handleApplyTheme(theme)}>
                  <Check className="mr-2 h-4 w-4" /> Apply
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => handleDeleteTheme(theme.id, theme.name, e)}
                  className="text-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No custom themes yet</h3>
          <p className="mt-2 text-muted-foreground">
            Create your first theme to customize the look and feel of your store
          </p>
          <Button onClick={() => setShowAddDialog(true)} className="mt-4">
            Create a Theme
          </Button>
        </div>
      )}

      {/* Create theme dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Custom Theme</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="theme-name" className="text-right">Name</Label>
              <Input
                id="theme-name"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                className="col-span-3"
                placeholder="My Beautiful Theme"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="primary-color" className="text-right">Primary</Label>
              <div className="col-span-3 flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="secondary-color" className="text-right">Secondary</Label>
              <div className="col-span-3 flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: secondaryColor }}
                ></div>
                <Input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accent-color" className="text-right">Accent</Label>
              <div className="col-span-3 flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: accentColor }}
                ></div>
                <Input
                  id="accent-color"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bg-color" className="text-right">Background</Label>
              <div className="col-span-3 flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: backgroundColor }}
                ></div>
                <Input
                  id="bg-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="text-color" className="text-right">Text</Label>
              <div className="col-span-3 flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: textColor }}
                ></div>
                <Input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-4 p-4 rounded-lg" style={{
              backgroundColor: backgroundColor,
              color: textColor
            }}>
              <h3 className="text-lg font-bold mb-2">Preview</h3>
              <div className="flex gap-2 mb-4">
                <Button style={{
                  backgroundColor: primaryColor,
                  color: backgroundColor
                }}>Primary</Button>
                <Button style={{
                  backgroundColor: secondaryColor,
                  color: backgroundColor
                }}>Secondary</Button>
                <Button style={{
                  backgroundColor: accentColor,
                  color: backgroundColor
                }}>Accent</Button>
              </div>
              <p>This is how your theme will look with the selected colors.</p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddTheme}>
              Create Theme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThemeCustomizer;
