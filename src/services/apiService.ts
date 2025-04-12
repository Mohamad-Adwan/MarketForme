import { dbConfig } from '../config/dbConfig';
import { Product, User, Order } from '../types';

// Define the type for request options
interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  body?: string;
}
export interface RequestOptionsdata {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData; // 👈 allow both JSON and FormData
}

// Base API request function
const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
  const url = `${dbConfig.apiUrl}/${endpoint}`;
  
  try {
    console.log(`Making API request to: ${url}`, { options });
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`API response from ${url}:`, data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
function isFormData(value: any): value is FormData {
  return typeof value === 'object' && value instanceof FormData;
}

const apiRequestdata = async (endpoint: string, options: RequestOptionsdata = {}) => {
  const url = `${dbConfig.apiUrl}/${endpoint}`;

  try {
    const formDataUsed = isFormData(options.body);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(formDataUsed ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Product API functions
export const productApi = {
  getAll: () => apiRequest('products'),
  getProductById: (id1: number) => apiRequest(`products/${id1}`),
  getDashboard: () => apiRequest('products/Dasdashboard'),
  getFeatured: () => apiRequest('products/featured'),
  getByCategory: (category: string) => apiRequest(`products/category/${category}`),
  // addProduct: (productData: Partial<Product>) => 
  //   apiRequest('products', {
  //     method: 'POST',
  //     body: JSON.stringify(productData),
  //   }),
  addProduct: (formData: FormData) =>
    apiRequestdata('products', {
      method: 'POST',
      body: formData, // ✅ Send FormData directly
      // ⚠️ Do NOT set Content-Type, the browser will set it with correct boundary
    }),
  // updateProduct: (id: number, productData: Partial<Product>) => 
  //   apiRequest(`products/${id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify(productData),
  //   }),
   updateProduct: (id: number, formData: FormData) => 
    apiRequestdata(`products/${id}`, {
      method: 'PUT',
      body: formData, 
    }),
  deleteProduct: (id1: number) => 
    apiRequest(`products/${id1}`, {
      method: 'DELETE',
    }),

  uploadImage: (formData: FormData) => {
    return fetch(`${dbConfig.apiUrl}/products/upload-image`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      return response.json();
    });
  },
};

// Auth API functions
export const authApi = {
  getDashboard: () => apiRequest('auth/Dasdashboard'),

  login: (email: string, password: string) => 
    apiRequest('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) => 
    apiRequest('auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  verifyEmail: (email: string, code: string) =>
    apiRequest('auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),
    registerWithPhone:  (email: string, phoneNumber: string) => {
      
        apiRequest('auth/registerWithPhone', {
          method: 'POST',
                    body: JSON.stringify({
            email,
            phoneNumber,
          }),
        });
  
        return {
          message: 'Verification code sent via WhatsApp!',        
        }
      
 
  },
  sendPhoneVerificationCode: (phone: string,user_id:number) =>
    apiRequest('auth/send-phone-verification', {
      method: 'POST',
      body: JSON.stringify({ phone ,user_id}),
    }
    
    
  ),
    verifyphone: (phone: string, code: string) => {
    apiRequest('auth/verify-phone', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    })
  return {
    message: 'Phone number verified successfully!',
    
  };
  },
  forgotPassword: (email: string) =>
    apiRequest('auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (email: string, code: string, newPassword: string) =>
    apiRequest('auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    }),
    getCurrentUser: (token: string) => 
    apiRequest('auth/user', {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getAllUsers: (token: string) =>
    apiRequest('auth/users', {
      headers: { Authorization: `Bearer ${token}` },
    }),
    getuserbyID: (token: string ,userId:string) => 
      apiRequest(`auth/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
  updateUserRole: (token: string, userId: string, role: string) =>
    apiRequest('auth/user-role', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ userId, role }),
    }),
  deleteUser: (token: string, userId: string) =>
    apiRequest(`auth/user/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Cart API functions
export const cartApi = {
  getCart: (userId: string) => apiRequest(`cart/${userId}`),
  addToCart: (userId: string, id1: number, quantity: number, price: number,itemname:string) =>
    apiRequest(`cart/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id1, quantity, price ,itemname}),
    }),
  updateCartItem: (userId: string, id1: number, quantity: number) => 
    apiRequest(`cart/${userId}/item/${id1}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  removeFromCart: (userId: string, id1: number) => 
    apiRequest(`cart/${userId}/item/${id1}`, {
      method: 'DELETE',
    }),
  clearCart: (userId: string) => 
    apiRequest(`cart/clear/${userId}`, {
      method: 'DELETE',
    }),
};

// Order API functions
export const orderApi = {
  getDashboard: () => apiRequest('orders/Dasdashboard'),

  getOrders: (token: string,userId: string) => 
    apiRequest(`orders/order/${userId}`,{
      headers: { Authorization: `Bearer ${token}` },
    }),
  getAllOrders: (token: string) => 
    apiRequest('orders', {
      headers: { Authorization: `Bearer ${token}` },
    }),
    
  createOrder: (userId: string, orderData: Partial<Order>) => 
    apiRequest('orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  getOrderDetails: (orderId: number) => 
    apiRequest(`orders/detail/${orderId}`),

  updateOrderStatus: (token: string, orderId: number, status: string) =>
    apiRequest(`orders/status/${orderId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),
  deleteOrder: (token: string, orderId: number) =>
    apiRequest(`orders/${orderId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
    deleteItem: (token: string, itemId: number,orderId:number) =>
      apiRequest(`orders/item/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId }),
      }),
      edititemQuantity: (  orderId: number,itemId: number, quantity: number) =>
      apiRequest(`orders/edit/item/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ orderId, quantity }),
      }),

};
