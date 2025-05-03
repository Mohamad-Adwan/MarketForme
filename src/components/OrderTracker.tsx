import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types';
import { Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { orderApi } from '@/services/apiService';

// هذه وظيفة وهمية للبحث عن الطلب برقم الهاتف
// في التطبيق الحقيقي، ستستبدل بطلب API حقيقي
const findOrderByPhone = async (phoneNumber: string): Promise<Order | null> => {
  try {
    // محاولة استخدام API أولاً
    const order = await orderApi.trackOrderByPhone(phoneNumber);
    return order;
  } catch (error) {
    console.error('Error using API, falling back to mock data:', error);
    
    // استخدام البيانات الوهمية كاحتياطي
  }
  }  




const OrderTracker: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
 

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to search for your order.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
        console.log(phoneNumber)
      const foundOrder = await findOrderByPhone(phoneNumber);
      
      if (foundOrder) {
        setOrder(foundOrder);
        
        // تخزين الطلب في localStorage للمستخدمين غير المسجلين
      
      } else {
        toast({
          title: "No order found",
          description: "We couldn't find a order associated with this number. Please check the number and try again.",
          variant: "destructive"
        });
        setOrder(null);
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "An error occurred while searching for your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Tracking your order</CardTitle>
          <CardDescription>
            {user 
              ? "you can track your orders from your account page for more details or search by phone number here , Dont forget to add Introduction to your country."
              : "Enter the phone number associated with your order to check its status ,Dont forget to add Introduction to your country."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div className="flex space-x-2 space-x-reverse">
              <div className="relative w-full">
                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-8"
                  type="tel"
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Tracking'}
              </Button>
            </div>
          </form>
        </CardContent>

        {order?.map((order) => (
  <CardFooter key={order.id2} className="flex flex-col">
    <div className="w-full space-y-4 border-t pt-4">
      <div className="flex justify-between">
        <span className="font-medium">Order Id</span>
        <span>#{order.id2}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Order Status:</span>
        <span>{order.status}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Order Date:</span>
        <span>{new Date(order.date || '').toLocaleDateString('en')}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Sub total:</span>
        <span>{order.total?.toFixed(2)}₪</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Delivery({order.deliveryOption}):</span>
        <span>{order.deliveryFee?.toFixed(2)}₪</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">Total:</span>
        <span>{(order.total+order.deliveryFee).toFixed(2)}₪</span>
      </div>
    </div>
  </CardFooter>
))}


        {!user && !order && (
          <CardFooter className="border-t text-center text-muted-foreground text-sm pt-4">
            <p>For a personalized experience and better order tracking, please<Button variant="link" className="p-0 h-auto" onClick={() => document.getElementById('login-button')?.click()}>Login</Button> or <Button variant="link" className="p-0 h-auto" onClick={() => document.getElementById('register-button')?.click()}>Register</Button>.</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default OrderTracker;
