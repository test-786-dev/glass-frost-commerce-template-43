
// Define custom layout types in a central place
export interface LayoutElement {
  id: string;
  type: 'hero' | 'text' | 'products' | 'banner' | 'image' | 'spacer' | 'grid' | 'bento' | 'marquee' | 'carousel';
  order: number;
  size: 'small' | 'medium' | 'large' | 'full';
  content?: string;
  background?: string;
  imageUrl?: string;
  items?: Array<{id: string, title: string, imageUrl: string, content: string}>;
  columns?: number;
}

export interface CustomLayout {
  id: string;
  name: string;
  sections: LayoutElement[];
  createdAt: string;
  elements?: LayoutElement[]; // For compatibility
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
