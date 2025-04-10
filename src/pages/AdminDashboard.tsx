
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  BarChart2, 
  Package, 
  ShoppingCart,
  Users,
} from 'lucide-react';

import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductsManagement from '@/components/admin/ProductsManagement';
import OrdersManagement from '@/components/admin/OrdersManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import { useAdminData } from '@/hooks/useAdminData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    products, 
    setProducts,
    displayOrders, 
    displayUsers, 
    stats,
    useMockData, 
    setUseMockData,
    ordersError,
    usersError,
    isLoadingOrders,
    isLoadingUsers,
    refetchOrders,
    refetchUsers,
    editingProduct,
    setEditingProduct,
    selectedImage,
    fileInputRef,
    handleImageChange,
    handleAddProduct,
    handleEditProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleChange,
    handleUpdateOrderStatus,
    handleUpdateUserRole,
    handleDeleteOrder,
    handleDeleteUser
  } = useAdminData();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  const ApiErrorBanner = () => {
    if (!useMockData) return null;
    
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>API Connection Issue</AlertTitle>
        <AlertDescription>
          We couldn't connect to the backend API. You are currently viewing sample data.
        </AlertDescription>
      </Alert>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-4">Manage your store</p>
      
      <ApiErrorBanner />
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <DashboardOverview 
            stats={stats} 
            displayOrders={displayOrders} 
            products={products} 
            isLoadingOrders={isLoadingOrders} 
            useMockData={useMockData}
          />
        </TabsContent>
        
        <TabsContent value="products">
          <ProductsManagement 
            products={products}
            handleAddProduct={handleAddProduct}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            //handleUpdateProduct={handleUpdateProduct}
            handleChange={handleChange}
            selectedImage={selectedImage}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
          />
        </TabsContent>
        
        <TabsContent value="orders">
          <OrdersManagement 
           // displayOrders={displayOrders}
            isLoadingOrders={isLoadingOrders}
            useMockData={useMockData}
            ordersError={ordersError}
            refetchOrders={refetchOrders}
            setUseMockData={setUseMockData}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            handleDeleteOrder={handleDeleteOrder}
          />
        </TabsContent>
        
        <TabsContent value="users">
          <UsersManagement 
            displayUsers={displayUsers}
            isLoadingUsers={isLoadingUsers}
            useMockData={useMockData}
            usersError={usersError}
            refetchUsers={refetchUsers}
            setUseMockData={setUseMockData}
            handleUpdateUserRole={handleUpdateUserRole}
            handleDeleteUser={handleDeleteUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
