import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi, orderApi, productApi } from '@/services/apiService';
import { products as initialProducts } from '@/data/products';
import { Product, User, Order, Stats } from '@/types';
import { toast } from 'sonner';

const mockOrders: Order[] = [
  {
    id2: 1,
    userId: '1',
    userName: 'Admin User',
    date: new Date().toISOString(),
    status: 'pending',
    total: 299.98,
    items: [
      // {
      //   productId: 1,
      //   productName: 'Premium Headphones',
      //   quantity: 1,
      //   price: 199.99
      // },
      // {
      //   productId: 3,
      //   productName: 'Bluetooth Speaker',
      //   quantity: 1,
      //   price: 99.99
      // }
    ]
  },
  {
    id2: 2,
    userId: '2',
    userName: 'Regular User',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'delivered',
    total: 249.99,
    items: [
      // {
      //   productId: 2,
      //   productName: 'Smart Watch',
      //   quantity: 1,
      //   price: 249.99
      // }
    ]
  },
  {
    id2: 3,
    userId: '3',
    userName: 'Jane Smith',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'shipped',
    total: 129.95,
    items: [
      // {
      //   productId: 4,
      //   productName: 'Wireless Earbuds',
      //   quantity: 1,
      //   price: 129.95
      // }
    ]
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    ordersCount: 2
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    ordersCount: 1
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    joinDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    ordersCount: 1
  }
];

export const useAdminData = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOrderStatus, setEditingOrderStatus] = useState<{id: number, status: string} | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<{id: string, role: string} | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState<Stats>({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentSales: []
  });
  
  const token = localStorage.getItem('authToken') || '';
  
  const { 
    data: apiUsers = [], 
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => authApi.getAllUsers(token),
    enabled: !!token && !useMockData,
    retry: 1,
  });
  
  const { 
    data: apiOrders = [], 
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders
  } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => orderApi.getAllOrders(token),
    enabled: !!token && !useMockData,
    retry: 1,
  });

  useEffect(() => {
    if ((ordersError || usersError) && !useMockData) {
      setUseMockData(true);
      toast.info('Using sample data since the API is unavailable');
    }
  }, [ordersError, usersError, useMockData]);
  
  const displayOrders = useMockData ? mockOrders : apiOrders;
  const displayUsers = useMockData ? mockUsers : apiUsers;
  
  useEffect(() => {
    if (displayOrders.length > 0 && displayUsers.length > 0) {
      const totalSales = displayOrders.reduce((sum, order) => sum + order.total, 0);
      
      const salesByDay = new Map();
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      displayOrders.forEach(order => {
        const date = new Date(order.date);
        const day = days[date.getDay()];
        const currentAmount = salesByDay.get(day) || 0;
        salesByDay.set(day, currentAmount + order.total);
      });
      
      const recentSales = days.map(day => ({
        date: day,
        amount: salesByDay.get(day) || 0
      }));
      
      setStats({
        totalSales,
        totalOrders: displayOrders.length,
        totalUsers: displayUsers.length,
        totalProducts: products.length,
        recentSales
      });
    }
  }, [displayOrders, displayUsers, products]);

  const handleDeleteOrder = async (orderId: number) => {
    if (useMockData) {
      const orderIndex = mockOrders.findIndex(order => order.id2 === orderId);
      if (orderIndex !== -1) {
        mockOrders.splice(orderIndex, 1);
        toast.success('Order deleted successfully');
        const updatedOrders = [...mockOrders];
        mockOrders.length = 0;
        mockOrders.push(...updatedOrders);
      }
      return;
    }
    
    try {
      await orderApi.deleteOrder(token, orderId);
      toast.success('Order deleted successfully');
      refetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
      console.error('Error deleting order:', error);
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (useMockData) {
      const userIndex = mockUsers.findIndex(user => user.id === userId);
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
        toast.success('User deleted successfully');
        const updatedUsers = [...mockUsers];
        mockUsers.length = 0;
        mockUsers.push(...updatedUsers);
      }
      return;
    }
    
    try {
      await authApi.deleteUser(token, userId);
      toast.success('User deleted successfully');
      refetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };
  
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    if (selectedImage) {
      if (useMockData) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            const updatedProduct = {
              ...editingProduct,
              image: e.target.result as string
            };
            
            setProducts(prevProducts => 
              prevProducts.map(p => 
                p.id1 === updatedProduct.id1 ? updatedProduct : p
              )
            );
            
            toast.success(`Product "${updatedProduct.name}" updated successfully`);
            setEditingProduct(null);
            setSelectedImage(null);
          }
        };
        reader.readAsDataURL(selectedImage);
        return;
      }
      
      try {
        const formData = new FormData();
        formData.append('image', selectedImage);
        
        const response = await productApi.uploadImage(formData);
        
        const updatedProduct = {
          ...editingProduct,
          image: response.imageUrl
        };
        
        try {
          const updatedProductFromApi = await productApi.updateProduct(editingProduct.id1, updatedProduct);
          setProducts(prevProducts => 
            prevProducts.map(p => 
              p.id1 === updatedProductFromApi.id ? updatedProductFromApi : p
            )
          );
          
          toast.success(`Product "${updatedProductFromApi.name}" updated successfully`);
        } catch (error) {
          console.error('Error updating product:', error);
          setProducts(prevProducts => 
            prevProducts.map(p => 
              p.id1 === updatedProduct.id1 ? updatedProduct : p
            )
          );
          toast.success(`Product "${updatedProduct.name}" updated in local state`);
        }
        
        setEditingProduct(null);
        setSelectedImage(null);
      } catch (error) {
        toast.error('Failed to upload image');
        console.error('Error uploading image:', error);
      }
    } else {
      if (!useMockData) {
        const updatedProductFromApi = await productApi.updateProduct(editingProduct.id1, editingProduct);
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p.id1 === updatedProductFromApi.id ? updatedProductFromApi : p
          )
        );
        toast.success(`Product "${updatedProductFromApi.name}" updated successfully`);
      } else {
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p.id1 === editingProduct.id1 ? editingProduct : p
          )
        );
        toast.success(`Product "${editingProduct.name}" updated successfully`);
      }
      
      setEditingProduct(null);
    }
  };
  
  const handleDeleteProduct = async (id: number) => {
    const productToDelete = products.find(p => p.id1 === id);
    if (!productToDelete) return;
    
    try {
      if (!useMockData) {
        await productApi.deleteProduct(id);
      }
      
      setProducts(prevProducts => prevProducts.filter(p => p.id1 !== id));
      toast.success(`Product "${productToDelete.name}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting product:', error);
      setProducts(prevProducts => prevProducts.filter(p => p.id1 !== id));
      toast.success(`Product "${productToDelete.name}" deleted from local state`);
    }
  };
  
  const handleAddProduct = async () => {
    const newId = Math.max(...products.map(p => p.id1)) + 1;
    const newProduct: Product = {
      id1: newId,
      name: 'New Product',
      description: 'Description goes here',
      price: 0,
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
      category: 'Other',
      stock: 0
    };
    
    try {
      if (!useMockData) {
        // const addedProduct = await productApi.addProduct(newProduct);
        // setProducts(prevProducts => [...prevProducts, addedProduct]);
        // setEditingProduct(addedProduct);
      } else {
        setProducts(prevProducts => [...prevProducts, newProduct]);
        setEditingProduct(newProduct);
      }
      
      toast.success('New product added');
    } catch (error) {
      console.error('Error adding product:', error);
      setProducts(prevProducts => [...prevProducts, newProduct]);
      setEditingProduct(newProduct);
      toast.success('New product added to local state');
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) return;
    
    const { name, value, type, checked } = e.target;
    
    setEditingProduct(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        [name]: type === 'checkbox' 
          ? checked 
          : type === 'number' 
            ? parseFloat(value) 
            : value
      };
    });
  };
  
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    const validStatus = newStatus as Order['status'];
    
    if (useMockData) {
      const updatedMockOrders = mockOrders.map(order => 
        order.id2 === orderId ? { ...order, status: validStatus } : order
      );
      mockOrders.length = 0;
      mockOrders.push(...updatedMockOrders);
      toast.success('Order status updated successfully');
      setEditingOrderStatus(null);
      return;
    }
    
    try {
      await orderApi.updateOrderStatus(token, orderId, validStatus);
      toast.success('Order status updated successfully');
      refetchOrders();
      setEditingOrderStatus(null);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };
  
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    if (useMockData) {
      const updatedMockUsers = mockUsers.map(user => 
        user.id === userId ? { ...user, role: newRole as 'admin' | 'user' } : user
      );
      mockUsers.length = 0;
      mockUsers.push(...updatedMockUsers);
      toast.success('User role updated successfully');
      setEditingUserRole(null);
      return;
    }
    
    try {
      await authApi.updateUserRole(token, userId, newRole);
      toast.success('User role updated successfully');
      refetchUsers();
      setEditingUserRole(null);
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error updating user role:', error);
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return {
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
    editingOrderStatus,
    setEditingOrderStatus,
    editingUserRole,
    setEditingUserRole,
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
  };
};
