import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import OrderTracker from '@/components/OrderTracker';

const OrderTrackerPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Order Tracking</h1>
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Track Order</CardTitle>
            <CardDescription>
            Enter your phone number to track your order and know its current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrderTracker />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderTrackerPage;
