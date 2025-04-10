
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/apiService';
import { set } from 'date-fns';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users only used if API fails - for demo/fallback purposes
const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' as const },
  { id: '2', name: 'Regular User', email: 'user@example.com', password: 'user123', role: 'user' as const },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(mockUsers);
/////////////////////here edit
  useEffect(() => {
    // Check for existing user session in localStorage
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');
    if (token) {
     // fetchUserWithToken(token);
     if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoading(false);
      }
      else{     
         fetchUserWithToken(token);
      }
    } else {
      setIsLoading(false);
    }
    
    // Load users from localStorage if available (fallback)
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const fetchUserWithToken = async (token: string) => {
    try {
      const userData = await authApi.getCurrentUser(token);
      setUser(userData);
      ////////////////////////here edit
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      // Optionally, you can also store the token in localStorage 
      localStorage.setItem('authToken', token);
      ////////////////////////
      
    } catch (error) {
      console.error('Failed to fetch user with token:', error);

      localStorage.removeItem('authToken');
      ///////////////////////here edit
      // Optionally, you can clear the user from localStorage if the token is invalid
      localStorage.removeItem('currentUser');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Try to log in via API
      const response = await authApi.login(email, password);
      const { user: userData, token } = response;
      
      setUser(userData);
      localStorage.setItem('authToken', token);
      ////////////////////////here edit
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } catch (error) {
      console.error('API login failed, falling back to mock data:', error);
      
      // Fallback to mock data if API fails
      const foundUser = users.find(
        (u) => u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Remove password before storing in state
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Try to register via API
      const response = await authApi.register(name, email, password);
      const { user: userData, token } = response;
      
      setUser(userData);
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error('API registration failed, falling back to mock data:', error);
      
      // Fallback to mock data if API fails
      // Check if email already exists
      if (users.some(u => u.email === email)) {
        setIsLoading(false);
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser = {
        id: String(users.length + 1),
        name,
        email,
        password,
        role: 'user' as const
      };
      
      // Add to users array
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Save to localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Auto login the new user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
