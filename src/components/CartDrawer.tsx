
import React, { useEffect, useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, CheckSquare, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { cartApi, globalApi, orderApi } from '@/services/apiService';
import { authApi } from '@/services/apiService';
import PhoneVerificationModal from './PhoneVerificationModal'; // Import the PhoneVerificationModal
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [isOnoff, setisOnOff] = useState(false);
  const [isCreatingOrderGuest, setIsCreatingOrderGuest] = useState(false);
  const [isCreatingOrderrwithoutvirfy, setIsCreatingOrderwithoutvirfy] = useState(false);
  const [countryCode, setCountryCode] = useState('+970'); // Default to US
  const [phoneNumber, setPhoneNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('pickup');
  const getDeliveryFee = () => {
    switch (deliveryOption) {
      case'west bank':
        return 20;
      case 'jerusalem':
        return 50;
      case 'interior':
        return 70;
      default:
        return 0;
    }
  };
    const handleClose = () => {
      setPhoneNumber('');
      setIsSubmitting(false);
      setIsCreatingOrderwithoutvirfy(false);
      setIsCreatingOrderGuest(false);
    };
  const handleCheckout = async () => {
    if (!user || cartItems.length === 0) {
      toast.error('Cannot checkout with an empty cart');
      return;
    }
    
    const token = localStorage.getItem('authToken');
    const user_check = await authApi.getCurrentUser(token);

    // if (!user_check.phoneVerified) { 
    //   setShowPhoneVerification(true);
    //   toast.error('Please verify your phone number to proceed with checkout');
    //   return;
    // }
    if (!user_check.phone) { 
      setIsCreatingOrderwithoutvirfy(true);
      onClose();

      toast.error('Please verify your phone number to proceed with checkout');
      return;
    }

    createOrder();
  };
  const handleCheckoutGuest = async () => {
    if (!isOnoff || cartItems.length === 0) {
      toast.error('Cannot checkout with an empty cart');
      return;
    }
    
    createOrderGuest();
  };
const createOrderGuest = async () => {
    setIsCreatingOrderGuest(true);

};
const countryCodes = [
  { code: '+1', name: 'United States/Canada' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+91', name: 'India' },
  { code: '+61', name: 'Australia' },
  { code: '+52', name: 'Mexico' },
  { code: '+33', name: 'France' },
  { code: '+49', name: 'Germany' },
  { code: '+39', name: 'Italy' },
  { code: '+34', name: 'Spain' },
  { code: '+86', name: 'China' },
  { code: '+81', name: 'Japan' },
  { code: '+82', name: 'South Korea' },
  { code: '+55', name: 'Brazil' },
  { code: '+7', name: 'Russia' },
  { code: '+27', name: 'South Africa' },
  { code: '+971', name: 'United Arab Emirates' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+20', name: 'Egypt' },
  { code: '+234', name: 'Nigeria' },
  { code: '+254', name: 'Kenya' },
  { code: '+970', name: 'Palestine' },
  { code: '+972', name: 'Israeli occupation' },
];
const handleOrderSubmitwithoutverify = async () => {
  
  const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`;
  //console.log(user.email,fullPhoneNumber)

  await authApi.registerWithPhone(
    user.email,
    fullPhoneNumber
  );
  setIsCreatingOrderwithoutvirfy(false);
  const orderData = {
    userId: user.id,
    userName: user.name,
    total: subtotal,
    deliveryOption: deliveryOption,
    deliveryFee: getDeliveryFee(),
    items: cartItems.map(item => ({
      id1: item.id1, // Ensure id1 is used
      itemname: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image 
    }))
  };
  try {
    
    const response = await orderApi.createOrder(user.id, orderData);
    //console.log('Order creation response:', response);

    if (response) {
      toast.success('Order created successfully!');
       await cartApi.clearCart(user.id);

      clearCart();
      onClose();
    }
    

  }
  catch (error) {
    console.error('Error saving guest order:', error);
    toast.error('Failed to save order. Please try again.');
  }
  finally {
    setIsCreatingOrderGuest(false);
    setGuestName('');
    setGuestPhone('');
  }

}
const handleGuestOrderSubmit = async () => {
  if (!guestName || !guestPhone) {
    toast.error("Please fill in both name and phone.");
    return;
  }

  const randomId = Math.floor(Math.random() * 1000000); // 🔥 ID عشوائي للطلب

  const orderData = {
    userId: randomId,
    userName: guestName,
    phone: guestPhone,
    total: subtotal,
    deliveryOption: deliveryOption,
        deliveryFee: getDeliveryFee(),
    items: cartItems.map(item => ({
      id1: item.id1,
      itemname: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }))
  };
  
 
  try {
     const response = await orderApi.createOrderGuest(orderData);

    // const pendingGuestOrders = JSON.parse(localStorage.getItem('pendingGuestOrders') || '[]');
    // pendingGuestOrders.push({
    //   ...orderData,
    //   id: Date.now(),
    //   date: new Date().toISOString(),
    //   status: 'pending'
    // });
    // localStorage.setItem('pendingGuestOrders', JSON.stringify(pendingGuestOrders));
    setIsCreatingOrderGuest(false);
    toast.success("Order saved successfully!");

    clearCart();
    onClose();
  } catch (error) {
    console.error('Error saving guest order:', error);
    toast.error('Failed to save order. Please try again.');
  } finally {
    setIsCreatingOrderGuest(false);
    setGuestName('');
    setGuestPhone('');
  }
};

  const createOrder = async () => {
    setIsCreatingOrder(true);
    try {
      const orderData = {
        userId: user.id,
        userName: user.name,
        total: subtotal,
        deliveryOption: deliveryOption,
        deliveryFee: getDeliveryFee(),

        items: cartItems.map(item => ({
          id1: item.id1, // Ensure id1 is used
          itemname: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image 
        }))
      };

      try {
        
       // console.log('Creating order with data:', orderData);
        const response = await orderApi.createOrder(user.id, orderData);
        //console.log('Order creation response:', response);

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
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await globalApi.getmakeorder();
        // Assuming response = { showPrice: true/false }
        setisOnOff(response.showPrice || false);
      } catch (error) {
        console.error("Failed to fetch status:", error);
      }
    };

    fetchStatus();
  }, []);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await globalApi.getmakeorder();
        console.log('API response:', response);
        // Assuming response = { showPrice: true/false }
        setisOnOff(response.allowmakeorder || false);
      } catch (error) {
        console.error("Failed to fetch status:", error);
      }
    };

    fetchStatus();
  }, []);
  const deliveryFee = getDeliveryFee();
  const total = subtotal + deliveryFee;
  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Your Shopping Cart</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 flex-1 overflow-y-auto">
            {!user && !isOnoff ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Please login to view your cart</p>
              </div>
            ) : (cartItems.length === 0 ) ? (
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
          
          {user  && cartItems.length > 0 && (
            <SheetFooter className="border-t pt-4 mt-4">
              <div className="w-full space-y-4">
              <div className="flex justify-between py-2 ">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}₪</span>
                </div>
                <div className="flex justify-between py-2">
                <span>Delivery fees:</span>
                <span>{deliveryFee.toFixed(2)}₪</span>
              </div>
              <div className="flex justify-between py-2 font-bold">
                <span>Total:</span>
                <span>{total.toFixed(2)}₪</span>
              </div>
              <div className="space-y-2">
              <label className="font-medium">Delivery options</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="radio"
                    id="pickup"
                    name="delivery"
                    value="pickup"
                    checked={deliveryOption === "pickup"}
                    onChange={() => setDeliveryOption("pickup")}
                  />
                  <label htmlFor="pickup">Pick up from the store (no fees)</label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="radio"
                    id="west bank"
                    name="delivery"
                    value="west bank"
                    checked={deliveryOption === "west bank"}
                    onChange={() => setDeliveryOption("west bank")}
                  />
                  <label htmlFor="west bank">Delivery to the West Bank (20 NIS)</label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="radio"
                    id="jerusalem"
                    name="delivery"
                    value="jerusalem"
                    checked={deliveryOption === "jerusalem"}
                    onChange={() => setDeliveryOption("jerusalem")}
                  />
                  <label htmlFor="jerusalem">Delivery to Jerusalem (50 NIS)</label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="radio"
                    id="interior"
                    name="delivery"
                    value="interior"
                    checked={deliveryOption === "interior"}
                    onChange={() => setDeliveryOption("interior")}
                  />
                  <label htmlFor="interior">Delivery to the occupied territories (70 NIS)</label>
                </div>
              </div>
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
          {isOnoff && !user  && cartItems.length > 0 && (
            <SheetFooter className="border-t pt-4 mt-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between py-2 ">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}₪</span>
                </div>
                <div className="flex justify-between py-2">
                <span>Delivery fees:</span>
                <span>{deliveryFee.toFixed(2)}₪</span>
              </div>
              <div className="flex justify-between py-2 font-bold">
                <span>Total:</span>
                <span>{total.toFixed(2)}₪</span>
              </div>
              <div className="space-y-2">
              <label className="font-medium">Delivery options</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="radio"
                    id="pickup"
                    name="delivery"
                    value="pickup"
                    checked={deliveryOption === "pickup"}
                    onChange={() => setDeliveryOption("pickup")}
                  />
                  <label htmlFor="pickup">Pick up from the store (no fees)</label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="radio"
                    id="west bank"
                    name="delivery"
                    value="west bank"
                    checked={deliveryOption === "west bank"}
                    onChange={() => setDeliveryOption("west bank")}
                  />
                  <label htmlFor="west bank">Delivery to the West Bank (20 NIS)</label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="radio"
                    id="jerusalem"
                    name="delivery"
                    value="jerusalem"
                    checked={deliveryOption === "jerusalem"}
                    onChange={() => setDeliveryOption("jerusalem")}
                  />
                  <label htmlFor="jerusalem">Delivery to Jerusalem (50 NIS)</label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="radio"
                    id="interior"
                    name="delivery"
                    value="interior"
                    checked={deliveryOption === "interior"}
                    onChange={() => setDeliveryOption("interior")}
                  />
                  <label htmlFor="interior">Delivery to the occupied territories (70 NIS)</label>
                </div>
              </div>
            </div>
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={handleCheckoutGuest} 
                    className="w-full"
                    disabled={isCreatingOrderGuest}
                  >
                    <CheckSquare className="h-5 w-5 mr-2" />
                    {isCreatingOrderGuest ? 'Processing...' : 'Create Order'}
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
      {isCreatingOrderGuest && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-80 space-y-4">
      <h2 className="text-lg font-semibold text-center">Complete your Order</h2>
      <Label>Name</Label>
      <input 
        type="text" 
        placeholder="Enter your name" 
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <Label>Phone Number</Label>
      <input 
        type="text" 
        placeholder="Enter your phone" 
        value={guestPhone}
        onChange={(e) => setGuestPhone(e.target.value)}
        className="w-full p-2 border rounded"
      />
      
      <div className="flex justify-end space-x-2">
      <Button 
                onClick={handleGuestOrderSubmit} 
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Done'}
      </Button>
      <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              </div>
    </div>
  </div>
)}
{isCreatingOrderrwithoutvirfy && (
  <div className="fixed inset-0  z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-100 space-y-4  ">
      <h2 className="text-lg font-semibold text-center">Complete your Order</h2>
      <div className="space-y-4 py-2">

            <div className="space-y-2">
              
              <Label>Phone Number</Label>
                            
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Country Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  type="tel"
                  className="flex-1"
                />
                
              </div>
              </div>
              </div>
              <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleOrderSubmitwithoutverify} 
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Done'}
              </Button>
            </div>
       {/* <button 
        onClick={handleGuestOrderSubmit}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        Submit Order
      </button> */}
      </div>
      </div>
      

)}
      {/* {showPhoneVerification && (
        <PhoneVerificationModal 
          isOpen={showPhoneVerification}
          onClose={() => setShowPhoneVerification(false)}
          onVerificationSuccess={handleVerificationSuccess}
        />
      )} */}

    </>
  );
};

export default CartDrawer;
