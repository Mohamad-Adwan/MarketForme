
import { Product } from '../types';

export const products: Product[] = [
  {
    id1: 1,
    name: 'Premium Headphones',
    description: 'Noise-cancelling wireless headphones with premium sound quality and long battery life.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Electronics',
    featured: true,
    stock: 25
  },
  {
    id1: 2,
    name: 'Smart Watch',
    description: 'Track your fitness, receive notifications, and more with this sleek smart watch.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Electronics',
    featured: true,
    stock: 15
  },
  {
    id1: 3,
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof speaker with amazing sound quality and 20-hour battery life.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Electronics',
    featured: false,
    stock: 30
  },
  {
    id1: 4,
    name: 'Professional Camera',
    description: 'High-resolution digital camera for professional photography and videography.',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Electronics',
    featured: true,
    stock: 10
  },
  {
    id1: 5,
    name: 'Laptop Backpack',
    description: 'Water-resistant backpack with padded laptop compartment and multiple pockets.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Accessories',
    featured: false,
    stock: 50
  },
  {
    id1: 6,
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with 12-cup capacity and built-in grinder.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1570486829859-eb11f4a3352a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Home',
    featured: true,
    stock: 20
  },
  {
    id1: 7,
    name: 'Gaming Console',
    description: 'Next-generation gaming console with 4K support and 1TB storage.',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Electronics',
    featured: true,
    stock: 8
  },
  {
    id1: 8,
    name: 'Wireless Earbuds',
    description: 'Compact earbuds with crystal clear sound and charging case.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    category: 'Electronics',
    featured: false,
    stock: 35
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id1 === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
