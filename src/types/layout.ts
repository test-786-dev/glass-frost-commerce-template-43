
// Define custom layout types in a central place
export interface LayoutElement {
  id: string;
  type: 'hero' | 'text' | 'products' | 'banner';
  order: number;
  size: 'small' | 'medium' | 'large' | 'full';
  content?: string;
  background?: string;
}

export interface CustomLayout {
  id: string;
  name: string;
  sections: LayoutElement[];
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
