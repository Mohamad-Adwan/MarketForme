
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { authApi, cartApi, globalApi } from '@/services/apiService';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isOnoff, setisOnOff] = useState(false);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await globalApi.getStatus();
        // Assuming response = { showPrice: true/false }
        setisOnOff(response.showPrice || false);
      } catch (error) {
        console.error("Failed to fetch status:", error);
      }
    };

    fetchStatus();
  }, []);
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // const token = localStorage.getItem('authToken');
    //     console.log(token);
    
        // const user = await authApi.getCurrentUser(token);
        // console.log(user);
        // await cartApi.addToCart(user.id,product.id1,1,product.price);
    setIsAdding(true);
    await addToCart(product);
    setIsAdding(false);
  };
  
  return (
    <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md flex flex-col">
      <div className="relative h-48 overflow-hidden">
        {product.featured && (
          <Badge className="absolute top-2 left-2 z-10">Featured</Badge>
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <h3 className="font-medium text-lg tracking-tight">{product.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="flex flex-col items-stretch gap-2 mt-auto">
        <div className="flex justify-between items-center w-full">
          {isOnoff ? (
            <span className="font-bold">${product.price.toFixed(2)}</span>
          ) : (
            <span className="text-muted-foreground italic"></span>
          )}
          <Badge variant="outline">{product.category}</Badge>
        </div>
        
        <div className="flex gap-2 w-full mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            asChild
          >
            <Link to={`/products/${product.id1}`}>
              <Eye className="h-4 w-4 mr-1" /> Details
            </Link>
          </Button>
          
          {user && (
            <Button 
              size="sm" 
              onClick={handleAddToCart} 
              className="flex-1"
              disabled={product.stock <= 0 || isAdding}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isAdding ? 'Adding...' : 'Add'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
