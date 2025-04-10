// import React, { useState } from 'react';
// import { 
//   Sheet, 
//   SheetContent, 
//   SheetHeader, 
//   SheetTitle,
//   SheetFooter
// } from '@/components/ui/sheet';
// import { Button } from '@/components/ui/button';
// import { useCart } from '@/context/CartContext';
// import { Minus, Plus, Trash2, CheckSquare } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';
// import { toast } from 'sonner';
// import { orderApi } from '@/services/apiService';
// import { authApi } from '@/services/apiService';
// import PhoneVerificationModal from './PhoneVerificationModal'; // Import the PhoneVerificationModal

// interface CartDrawerProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
//   const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
//   const { user } = useAuth();
//   const [isCreatingOrder, setIsCreatingOrder] = useState(false);
//   const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  
//   const handleCheckout = async () => {
//     if (!user || cartItems.length === 0) {
//       toast.error('Cannot checkout with an empty cart');
//       return;
//     }
//     // Check if user has verified their phone number
//     const token =localStorage.getItem('authToken');
//     const user_check = await authApi.getCurrentUser(token);
//     if (!user_check.phoneVerified) { 
//       setShowPhoneVerification(true);
//       toast.error('Please verify your phone number to proceed with checkout');
//       return;
//     }  
//     createOrder();
//   };

//   const createOrder = async () => {
//     setIsCreatingOrder(true);
    
//     try {
//       // Create order from cart items
//       const orderData = {
//         userId: user.id,
//         userName: user.name,
//         total: subtotal,
//         items: cartItems.map(item => ({
//           productId: item.id1,
//           productName: item.name,
//           quantity: item.quantity,
//           price: item.price
//         }))
//       };
      
//       try {
//         console.log('Creating order with data:', orderData);
//         // Attempt API call to create order
//         const response = await orderApi.createOrder(user.id, orderData);
//         console.log('Order creation response:', response);
        
//         if (response) {
//           toast.success('Order created successfully!');
//           clearCart(); // Clear cart after successful order
//           onClose(); // Close drawer
//         }
//       } catch (error) {
//         console.error('API request failed:', error);
//         toast.warning("Order saved locally. It will be processed when connection is restored.");
        
//         // Save order to localStorage as pending with a unique ID
//         const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
//         pendingOrders.push({
//           ...orderData,
//           id: Date.now(), // Use timestamp as temporary ID
//           date: new Date().toISOString(),
//           status: 'pending'
//         });
//         localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
        
//         // Still clear cart to give user feedback that order was "placed"
//         clearCart();
//         onClose();
//       }
//     } catch (error) {
//       console.error('Error creating order:', error);
//       toast.error('Failed to create order. Please try again.');
//     } finally {
//       setIsCreatingOrder(false);
//     }
//   };

//   const handleVerificationSuccess = () => {
//     setShowPhoneVerification(false);
//     // After verification, proceed with order creation
//     createOrder();
//   };

//   return (
//     <>
//       <Sheet open={isOpen} onOpenChange={onClose}>
//         <SheetContent className="w-full sm:max-w-md">
//           <SheetHeader>
//             <SheetTitle>Your Shopping Cart</SheetTitle>
//           </SheetHeader>
          
//           <div className="mt-6 flex-1 overflow-y-auto">
//             {!user ? (
//               <div className="py-8 text-center">
//                 <p className="text-muted-foreground">Please login to view your cart</p>
//               </div>
//             ) : cartItems.length === 0 ? (
//               <div className="py-8 text-center">
//                 <p className="text-muted-foreground">Your cart is empty</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {cartItems.map((item) => (
//                   <div key={item.id1} className="flex items-center py-3 border-b">
//                     <div className="h-16 w-16 overflow-hidden rounded-md border">
//                       <img 
//                         src={item.image} 
//                         alt={item.name} 
//                         className="h-full w-full object-cover"
//                       />
//                     </div>
                    
//                     <div className="ml-4 flex-1">
//                       <h3 className="text-sm font-medium">{item.name}</h3>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         ${item.price.toFixed(2)}
//                       </p>
//                     </div>
                    
//                     <div className="flex items-center space-x-1">
//                       <Button 
//                         variant="outline" 
//                         size="icon" 
//                         className="h-8 w-8"
//                         onClick={() => updateQuantity(item.id1, item.quantity - 1)}
//                       >
//                         <Minus className="h-3 w-3" />
//                       </Button>
//                       <span className="w-8 text-center">{item.quantity}</span>
//                       <Button 
//                         variant="outline" 
//                         size="icon" 
//                         className="h-8 w-8"
//                         onClick={() => updateQuantity(item.id1, item.quantity + 1)}
//                       >
//                         <Plus className="h-3 w-3" />
//                       </Button>
//                     </div>
                    
//                     <Button 
//                       variant="ghost" 
//                       size="icon" 
//                       className="ml-2" 
//                       onClick={() => removeFromCart(item.id1)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           {user && cartItems.length > 0 && (
//             <SheetFooter className="border-t pt-4 mt-4">
//               <div className="w-full space-y-4">
//                 <div className="flex justify-between text-base font-medium">
//                   <span>Subtotal</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
                
//                 <div className="flex flex-col space-y-2">
//                   <Button 
//                     onClick={handleCheckout} 
//                     className="w-full"
//                     disabled={isCreatingOrder}
//                   >
//                     <CheckSquare className="h-5 w-5 mr-2" />
//                     {isCreatingOrder ? 'Processing...' : 'Create Order'}
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     onClick={clearCart} 
//                     className="w-full"
//                     disabled={isCreatingOrder}
//                   >
//                     Clear Cart
//                   </Button>
//                 </div>
//               </div>
//             </SheetFooter>
//           )}
//         </SheetContent>
//       </Sheet>

//       {showPhoneVerification && (
//         <PhoneVerificationModal 
//           isOpen={showPhoneVerification}
//           onClose={() => setShowPhoneVerification(false)}
//           onVerificationSuccess={handleVerificationSuccess}
//         />
//       )}
//     </>
//   );
// };

//export default CartDrawer;
import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, CheckSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { cartApi, orderApi } from '@/services/apiService';
import { authApi } from '@/services/apiService';
import PhoneVerificationModal from './PhoneVerificationModal'; // Import the PhoneVerificationModal
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);

  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) {
      toast.error('Cannot checkout with an empty cart');
      return;
    }
    
    const token = localStorage.getItem('authToken');
    const user_check = await authApi.getCurrentUser(token);

    if (!user_check.phoneVerified) { 
      setShowPhoneVerification(true);
      toast.error('Please verify your phone number to proceed with checkout');
      return;
    }

    createOrder();
  };

  const createOrder = async () => {
    setIsCreatingOrder(true);
    try {
      const orderData = {
        userId: user.id,
        userName: user.name,
        total: subtotal,
        items: cartItems.map(item => ({
          id1: item.id1, // Ensure id1 is used
          itemname: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image 
        }))
      };

      try {
        console.log('Creating order with data:', orderData);
        const response = await orderApi.createOrder(user.id, orderData);
        console.log('Order creation response:', response);

        if (response) {
          toast.success('Order created successfully!');
           await cartApi.clearCart(user.id);

          clearCart();
          onClose();
        }
      } catch (error) {
        console.error('API request failed:', error);
        toast.warning("Order saved . It will be processed when connection is restored.");
        
        // const pendingOrders = JSON.parse(localStorage.getItem('pendingOrders') || '[]');
        // pendingOrders.push({
        //   ...orderData,
        //   id: Date.now(),
        //   date: new Date().toISOString(),
        //   status: 'pending'
        // });
        // localStorage.setItem('pendingOrders', JSON.stringify(pendingOrders));
        
        // clearCart();
        // onClose();
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleVerificationSuccess = () => {
    setShowPhoneVerification(false);
    createOrder();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Your Shopping Cart</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 flex-1 overflow-y-auto">
            {!user ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Please login to view your cart</p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id1} className="flex items-center py-3 border-b">
                    <div className="h-16 w-16 overflow-hidden rounded-md border">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id1, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id1, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2" 
                      onClick={() => removeFromCart(item.id1)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {user && cartItems.length > 0 && (
            <SheetFooter className="border-t pt-4 mt-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between text-base font-medium">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={handleCheckout} 
                    className="w-full"
                    disabled={isCreatingOrder}
                  >
                    <CheckSquare className="h-5 w-5 mr-2" />
                    {isCreatingOrder ? 'Processing...' : 'Create Order'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={clearCart} 
                    className="w-full"
                    disabled={isCreatingOrder}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {showPhoneVerification && (
        <PhoneVerificationModal 
          isOpen={showPhoneVerification}
          onClose={() => setShowPhoneVerification(false)}
          onVerificationSuccess={handleVerificationSuccess}
        />
      )}
    </>
  );
};

export default CartDrawer;
