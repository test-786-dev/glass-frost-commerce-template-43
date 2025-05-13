
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  category?: string;
}

// Export the products array
export const products = [
  {
    id: "1",
    name: "Classic Round Glasses",
    description: "Timeless design for everyday elegance.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1574854894785-c64dc99f7599?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviews: 42,
    category: "Eyewear"
  },
  {
    id: "2",
    name: "Modern Square Frames",
    description: "Bold and contemporary for a sharp look.",
    price: 149.50,
    image: "https://images.unsplash.com/photo-1616499494472-68549c3991ca?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.2,
    reviews: 35,
    category: "Eyewear"
  },
  {
    id: "3",
    name: "Vintage Aviator Style",
    description: "A classic design with a modern twist.",
    price: 135.00,
    image: "https://images.unsplash.com/photo-1534438327276-14e530d3cae6?q=80&w=2094&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 50,
    category: "Eyewear"
  },
  {
    id: "4",
    name: "Sleek Rectangular Glasses",
    description: "Understated elegance for a professional appearance.",
    price: 119.00,
    image: "https://images.unsplash.com/photo-1585314064435-9392c0146924?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.0,
    reviews: 28,
    category: "Eyewear"
  },
  {
    id: "5",
    name: "Chic Cat-Eye Frames",
    description: "Add a touch of glamour to your look.",
    price: 155.00,
    image: "https://images.unsplash.com/photo-1621905249798-88756495c103?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.3,
    reviews: 38,
    category: "Eyewear"
  },
  {
    id: "6",
    name: "Rimless Minimalist Design",
    description: "Barely-there frames for ultimate comfort.",
    price: 169.00,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
    reviews: 45,
    category: "Electronics"
  },
  {
    id: "7",
    name: "Sporty Active Glasses",
    description: "Durable and lightweight for active lifestyles.",
    price: 110.00,
    image: "https://images.unsplash.com/photo-1541736344-01f189194f13?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 3.9,
    reviews: 25,
    category: "Sports"
  },
  {
    id: "8",
    name: "Luxury Gold-Trimmed Frames",
    description: "Exquisite craftsmanship for a luxurious feel.",
    price: 199.00,
    image: "https://images.unsplash.com/photo-1585314064435-9392c0146924?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 52,
    category: "Luxury"
  },
];

export const getAllProducts = (): Product[] => products;

export const getFeaturedProducts = (): Product[] => {
  return products.slice(0, 4);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
