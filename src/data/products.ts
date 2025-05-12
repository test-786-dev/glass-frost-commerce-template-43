
import { Product } from "../contexts/StoreContext";

export const products: Product[] = [
  {
    id: "1",
    name: "Modern Desk Lamp",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Home Decor",
    description: "A sleek, adjustable desk lamp with touch controls and multiple brightness settings."
  },
  {
    id: "2",
    name: "Wireless Headphones",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    description: "Premium wireless headphones with noise cancellation and 30-hour battery life."
  },
  {
    id: "3",
    name: "Ceramic Plant Pot",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Home Decor",
    description: "Handmade ceramic pot perfect for small to medium indoor plants."
  },
  {
    id: "4",
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    description: "Advanced smartwatch with health tracking features and customizable watch faces."
  },
  {
    id: "5",
    name: "Linen Throw Pillow",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Home Decor",
    description: "Soft linen throw pillow with minimalist design, perfect for any couch or bed."
  },
  {
    id: "6",
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1564424224827-cd24b8915874?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    description: "Waterproof portable speaker with 360° sound and 12-hour playtime."
  },
  {
    id: "7",
    name: "Minimalist Wall Clock",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Home Decor",
    description: "Sleek wall clock with silent mechanism and premium materials."
  },
  {
    id: "8",
    name: "Wireless Charging Pad",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices."
  },
  {
    id: "9",
    name: "Scented Candle Set",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1602523069464-53fc0c853ab7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Home Decor",
    description: "Set of three premium scented candles in elegant glass containers."
  },
  {
    id: "10",
    name: "Fitness Tracker Band",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    description: "Water-resistant fitness tracker with heart rate monitor and sleep tracking."
  },
  {
    id: "11",
    name: "Modern Coffee Mug",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1577937927133-3b0a0fe2436b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Home Decor",
    description: "Ceramic coffee mug with minimalist design and comfortable handle."
  },
  {
    id: "12",
    name: "Wireless Earbuds",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    description: "True wireless earbuds with premium sound quality and compact charging case."
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.slice(0, 4);
};
