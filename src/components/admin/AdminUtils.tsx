
import { Order } from '@/types';
import { useState } from 'react';

export const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-purple-100 text-purple-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const useOrderStatusEditor = () => {
  const [editingOrderStatus, setEditingOrderStatus] = useState<{id: number, status: string} | null>(null);
  
  return {
    editingOrderStatus,
    setEditingOrderStatus
  };
};

export const useUserRoleEditor = () => {
  const [editingUserRole, setEditingUserRole] = useState<{id: string, role: string} | null>(null);
  
  return {
    editingUserRole,
    setEditingUserRole
  };
};
