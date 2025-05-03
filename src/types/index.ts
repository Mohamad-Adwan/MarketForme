import { JSX } from "react/jsx-runtime";

export interface Product {
  id1: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  stock: number;
  discountprice:number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  joinDate?: string;
  ordersCount?: number;
  phoneVerified?: boolean;
  phone?: string;
  emailVerified?: boolean;
  verificationCode?: string;
  resetCode?: string;
  createdAt?: Date;
}

export interface Order {
  id2: number;
  userId: string;
  userName: string;
  phone: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  deliveryOption: string;
  deliveryFee: number;
  items: {
    map(arg0: (item: any, index: any) => JSX.Element): import("react").ReactNode;
    id1: number;
    itemname: string;
    quantity: number;
    price: number;
    image: {
      data: Buffer; // use Buffer if you're storing raw binary data
      contentType: string;
      FileName: string;
    },
  }[];
}

export interface Stats {
  totalSales: number;
  pendingOrders: number;
  deliveredOrders: number;
  canceledOrders: number;
  processingOrders: number;
  shippedOrders: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentSales: {
    date: string;
    amount: number;
  }[];
}
export interface DateRangeFilter {
  from?: Date;
  to?: Date;
}