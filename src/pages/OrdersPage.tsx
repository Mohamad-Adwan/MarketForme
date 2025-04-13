
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Order } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock data for fallback when API is unavailable
// const mockOrders: Order[] = [
//   {
//     // id2: 1,
//     // userId: '1',
//     // userName: 'John Doe',
//     // date: new Date().toISOString(),
//     // status: 'pending',
//     // total: 299.98,
//     // items: [
//     //   // {
//     //   //   productId: 1,
//     //   //   productName: 'Premium Headphones',
//     //   //   quantity: 1,
//     //   //   price: 199.99
//     //   // },
//     //   // {
//     //   //   productId: 3,
//     //   //   productName: 'Bluetooth Speaker',
//     //   //   quantity: 1,
//     //   //   price: 99.99
//     //   // }
//     // ]
//   },
//   {
//     id2: 2,
//     userId: '1',
//     userName: 'John Doe',
//     date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
//     status: 'delivered',
//     total: 249.99,
//     items: [
//       // {
//       //   productId: 2,
//       //   itemname: 'Smart Watch',
//       //   quantity: 1,
//       //   price: 249.99
//       // }
//     ]
//   }
// ];

const OrdersPage = () => {
  const { user } = useAuth();
  const [useMockData, setUseMockData] = useState(false);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  
  // Load pending orders from localStorage
  // useEffect(() => {
  //   if (user) {
  //     const storedPendingOrders = localStorage.getItem('pendingOrders');
  //     if (storedPendingOrders) {
  //       try {
  //         const parsedOrders = JSON.parse(storedPendingOrders);
  //         // Filter to only show orders for current user
  //         const userPendingOrders = parsedOrders.filter((order: Order) => 
  //           order.userId === user.id
  //         );
  //         setPendingOrders(userPendingOrders);
  //       } catch (e) {
  //         console.error('Error parsing pending orders:', e);
  //       }
  //     }
  //   }
  // }, [user]);
  const token =localStorage.getItem("authToken")
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => orderApi.getOrders(token, user.id),
    enabled: !!user,
    retry: 1,
    
  });
  
  
  // Check if we should use mock data after the query fails
  const getDisplayOrders = () => {
     if (orders.length) {
      return orders;
    } 
    return [];
  };
  
  const displayOrders = getDisplayOrders();
  console.log('Display orders:', displayOrders);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>Please log in to view your orders</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  if (isLoading && !useMockData && pendingOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>Loading your order history...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/4 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
 
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>My Orders</CardTitle>
              <CardDescription>View your order history and track your purchases</CardDescription>
            </div>
            
          </div>
        </CardHeader>
        <CardContent>
          {displayOrders && displayOrders.length > 0 ? (
            <div className="space-y-6">
              {displayOrders.map((order: Order) => (
                <div key={`${order.id2}-${order.date}`} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">Order #{order.id2}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.date), 'PPP')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                      {/* {!order.id2 && " (Local)"} */}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                  <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-left">Item</th>
                              <th className="text-left">Image</th>
                              <th className="text-left">Quantity</th>
                              <th className="text-left">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Iterate through items array for the current order */}
                            {order.items && Array.isArray(order.items) && order.items.map((item, index) => (
                              <tr key={index}>
                                <td className="py-2">{item.itemname}</td>
                                <td className="py-2">
                                  {item.image && <img src={item.image} alt={item.itemname} className="w-16 h-16" />}
                                </td>
                                <td className="py-2">{item.quantity}</td>
                                
                                <td className="py-2">
                                  {item.price && <span>${item.price.toFixed(2)}</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex justify-between font-medium">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You haven't placed any orders yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
