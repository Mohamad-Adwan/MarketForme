
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProductById } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { authApi, cartApi, globalApi, productApi } from '@/services/apiService';
import { Product } from '@/types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  //const product = getProductById(Number(id));
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isOnoff, setisOnOff] = useState(false);
  const [isOnoff1, setisOnOff1] = useState(false);
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await globalApi.getmakeorder();
        // Assuming response = { showPrice: true/false }
        setisOnOff1(response.allowmakeorder || false);
      } catch (error) {
        console.error("Failed to fetch status:", error);
      }
    };

    fetchStatus();
  }, []);

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
  const handleAddToCart = async () => {
    if (!product) return;
    const token = localStorage.getItem('authToken');
    // console.log(token);

    const user = await authApi.getCurrentUser(token);
    // console.log(user);
    
  
    await cartApi.addToCart(user.id,product.id1,1,product.price,product.name );  
    
    // setIsAdding(true);
    // await addToCart(product);
    // setIsAdding(false);
  };
  useEffect(() => {
      const fetchCartItems = async () => {
        try {
          const items = await productApi.getProductById(Number(id)); // Assuming this fetches products
          setProduct(items);
        } catch (error) {
          console.error('Failed to fetch cart items:', error);
        }
      };
      fetchCartItems();
    }, []);
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Return to Products</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="flex items-center text-primary mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        {/* <div className="aspect-square overflow-hidden rounded-lg"> */}
        <div className=" overflow-hidden rounded-lg">
          <img 
            src={product.image} 
            alt={product.name} 
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"          />
        </div>
        
        {/* Product Details */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Badge variant="outline" className="text-sm">
              {product.category}
            </Badge>
          </div>
          

          {isOnoff ? (
            product.discountprice > 0 ? (
              <div>
               <div className="text-xl text-muted-foreground italic line-through">
               {product.price}₪
                  </div>
                <div className="text-2xl font-bold text-primary">
                  {product.discountprice}₪
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground italic">
                {product.price}₪
              </div>
            )
          ) : (
            <div className="text-muted-foreground italic">
            </div>
          )}
          
          <div className="pt-2">
            <h3 className="text-lg font-medium mb-2">Description:</h3>
            <p className="text-muted-foreground">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center pt-2">
            <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
            {product.stock > 0 && (
              <span className="ml-2 text-muted-foreground">
                ({product.stock} available)
              </span>
            )}
          </div>
          
          {(user || isOnoff1) && (
            <Button 
              onClick={handleAddToCart}
              className="mt-4"
              size="lg"
              disabled={product.stock <= 0 || isAdding}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
            </Button>
          )}
          
          {!user && !isOnoff1 && (
            <div className="border rounded-lg p-4 bg-muted/20 mt-4">
              <p className="text-sm text-muted-foreground">
                You need to be logged in to purchase this product.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
