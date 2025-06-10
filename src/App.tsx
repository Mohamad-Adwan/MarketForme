
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetail from "./pages/ProductDetail";
import ProjectDetail from "./pages/ProjectDetail";

import AccountPage from "./pages/AccountPage";
import AdminDashboard from "./pages/AdminDashboard";
import OrdersPage from "./pages/OrdersPage";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/AdminRoute";
import OrderTrackerPage from "./pages/OrderTrackerPage";
import OurProjectsPage from "./pages/OurProjectsPage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/our-projects" element={<OurProjectsPage />}/>
                <Route path="/account" element={<AccountPage />} />
                <Route path="/admin" element={ <AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/order-tracker" element={<OrderTrackerPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
