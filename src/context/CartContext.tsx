
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { Product } from '../types';
// import { useAuth } from './AuthContext';
// import { toast } from 'sonner';
// import { cartApi } from '../services/apiService';

// interface CartItem extends Product {
//   quantity: number;
// }

// type CartContextType = {
//   cartItems: CartItem[];
//   addToCart: (product: Product) => void;
//   removeFromCart: (productId: number) => void;
//   updateQuantity: (productId: number, quantity: number) => void;
//   clearCart: () => void;
//   totalItems: number;
//   subtotal: number;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const { user } = useAuth();
  
//   // Load cart from API or localStorage when component mounts or user changes
//   useEffect(() => {
//     if (user) {
//       fetchCartItems();
//     } else {
//       setCartItems([]);
//     }
//   }, [user]);

//   const fetchCartItems = async () => {
//     if (!user) return;
    
//     try {
//       const cart = await cartApi.getCart(user.id);
//       setCartItems(cart.items || []);
//     } catch (error) {
//       console.error('Failed to fetch cart, falling back to localStorage:', error);
//       // Fallback to localStorage
//       const savedCart = localStorage.getItem(`cart_${user.id}`);
//       if (savedCart) {
//         setCartItems(JSON.parse(savedCart));
//       }
//     }
//   };

//   // Save cart to localStorage whenever it changes as a backup
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
//     }
//   }, [cartItems, user]);

//   const addToCart = async (product: Product) => {
//     if (!user) {
//       toast.error("Please log in to add items to cart");
//       return;
//     }
    
//     try {
//       const existingItem = cartItems.find(item => item.id1 === product.id1);
//       const quantity = existingItem ? existingItem.quantity + 1 : 1;
      
//       try {
//         // Attempt API call but continue even if it fails
//         await cartApi.addToCart(user.id, product.id1, quantity,product.price);
//       } catch (error) {
//         console.error('API request failed:', error);
//         // Continue with local state update even if API fails
//         toast.warning("Added to cart locally. Changes will sync when connection is restored.");
//       }
      
//       // Update local state regardless of API success
//       setCartItems(prevItems => {
//         const existingItemIndex = prevItems.findIndex(item => item.id1 === product.id1);
        
//         if (existingItemIndex >= 0) {
//           // Item already exists, increase quantity
//           const updatedItems = [...prevItems];
//           updatedItems[existingItemIndex] = {
//             ...updatedItems[existingItemIndex],
//             quantity: updatedItems[existingItemIndex].quantity + 1
//           };
//           toast.success(`Added another ${product.name} to cart`);
//           return updatedItems;
//         } else {
//           // Add new item with quantity 1
//           toast.success(`Added ${product.name} to cart`);
//           return [...prevItems, { ...product, quantity: 1 }];
//         }
//       });
//     } catch (error) {
//       console.error('Failed to add item to cart:', error);
//       toast.error("Failed to add item to cart");
//     }
//   };

//   const removeFromCart = async (productId: number) => {
//     if (!user) return;
    
//     try {
//       try {
//         // Attempt API call but continue even if it fails
//         await cartApi.removeFromCart(user.id, productId);
//       } catch (error) {
//         console.error('API request failed:', error);
//         toast.warning("Removed from cart locally. Changes will sync when connection is restored.");
//       }
      
//       // Update local state regardless of API success
//       setCartItems(prevItems => prevItems.filter(item => item.id1 !== productId));
//       toast.info("Item removed from cart");
//     } catch (error) {
//       console.error('Failed to remove item from cart:', error);
//       toast.error("Failed to remove item from cart");
//     }
//   };

//   const updateQuantity = async (productId: number, quantity: number) => {
//     if (!user) return;
    
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }
    
//     try {
//       try {
//         // Attempt API call but continue even if it fails
//         await cartApi.updateCartItem(user.id, productId, quantity);
//       } catch (error) {
//         console.error('API request failed:', error);
//         toast.warning("Updated cart locally. Changes will sync when connection is restored.");
//       }
      
//       // Update local state regardless of API success
//       setCartItems(prevItems => 
//         prevItems.map(item => 
//           item.id1 === productId ? { ...item, quantity } : item
//         )
//       );
//     } catch (error) {
//       console.error('Failed to update item quantity:', error);
//       toast.error("Failed to update item quantity");
//     }
//   };

//   const clearCart = async () => {
//     if (!user) return;
    
//     try {
//       try {
//         // Attempt API call but continue even if it fails
//         await cartApi.clearCart(user.id);
//       } catch (error) {
//         console.error('API request failed:', error);
//         toast.warning("Cleared cart locally. Changes will sync when connection is restored.");
//       }
      
//       // Update local state regardless of API success
//       setCartItems([]);
//       toast.info("Cart cleared");
//     } catch (error) {
//       console.error('Failed to clear cart:', error);
//       toast.error("Failed to clear cart");
//     }
//   };

//   const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  
//   const subtotal = cartItems.reduce(
//     (total, item) => total + item.price * item.quantity, 
//     0
//   );

//   return (
//     <CartContext.Provider value={{
//       cartItems,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       totalItems,
//       subtotal
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { cartApi } from '../services/apiService';

interface CartItem extends Product {
  quantity: number;
}

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  
  // Load cart from API or localStorage when component mounts or user changes
  useEffect(() => {
    const loadCart = async () => {
      if (!user) return setCartItems([]);
      
      try {
        const cart = await cartApi.getCart(user.id);
        setCartItems(cart.items || []);
      } catch (error) {
        console.error('Failed to fetch cart, falling back to localStorage:', error);
        // const savedCart = localStorage.getItem(`cart_${user.id}`);
        // if (savedCart) {
        //   setCartItems(JSON.parse(savedCart));
        // }
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage whenever it changes as a backup
  useEffect(() => {
    if (user && cartItems.length > 0) {
      // localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product: Product) => {
    if (!user) {
      toast.error("Please log in to add items to cart");
      return;
    }

    try {
      const existingItem = cartItems.find(item => item.id1 === product.id1);
      const quantity = existingItem ? existingItem.quantity + 1 : 1;

      // Attempt API call, continue even if it fails
      try {
        await cartApi.addToCart(user.id, product.id1, quantity, product.price, product.image,product.name);
      } catch (error) {
        console.error('API request failed:', error);
        toast.warning("Added to cart locally. Changes will sync when connection is restored.");
      }

      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.id1 === product.id1);
        
        if (existingItemIndex >= 0) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1
          };
          toast.success(`Added another ${product.name} to cart`);
          return updatedItems;
        } else {
          toast.success(`Added ${product.name} to cart`);
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error("Failed to add item to cart");
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!user) return;
    
    try {
      // Attempt API call, continue even if it fails
      try {
        await cartApi.removeFromCart(user.id, productId);
      } catch (error) {
        console.error('API request failed:', error);
        toast.warning("Removed from cart locally. Changes will sync when connection is restored.");
      }

      setCartItems(prevItems => prevItems.filter(item => item.id1 !== productId));
      toast.info("Item removed from cart");
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      toast.error("Failed to remove item from cart");
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      try {
        await cartApi.updateCartItem(user.id, productId, quantity);
      } catch (error) {
        console.error('API request failed:', error);
        toast.warning("Updated cart locally. Changes will sync when connection is restored.");
      }

      setCartItems(prevItems => prevItems.map(item =>
        item.id1 === productId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error('Failed to update item quantity:', error);
      toast.error("Failed to update item quantity");
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      try {
        await cartApi.clearCart(user.id);
      } catch (error) {
        console.error('API request failed:', error);
        toast.warning("Cleared cart locally. Changes will sync when connection is restored.");
      }

      setCartItems([]);
      toast.info("Cart cleared");
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error("Failed to clear cart");
    }
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

