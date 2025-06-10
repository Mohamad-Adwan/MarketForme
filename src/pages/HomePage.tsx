
import { Link } from 'react-router-dom';
import { ArrowRight, Projector } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import ProjectCard from '@/components/ProjectCard';

import { getFeaturedProducts } from '@/data/products';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { productApi } from '@/services/apiService';
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { projectApi } from '@/services/apiService';
import { Project } from '@/types';

const HomePage = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // To store fetched products
  const [projects, setProjects] = useState<Project[]>([]); // To store fetched products

  type Product = {
    id1: number;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    stock: number;
    featured?: boolean;
    discountprice:number;

    
  };
  
  
  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const items = await productApi.getAll(); 
        setCartItems(items);
        const projectss = await projectApi.getAll(); 
        setProjects(projectss);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };
    fetchCartItems();
  }, []);
 
 

  const discountedProducts = products.filter(
    (product) => product.discountprice && product.discountprice > 0
  );
  
  function AutoplayPlugin(slider) {
    let timeout;
    let mouseOver = false;
  
    function clearNextTimeout() {
      clearTimeout(timeout);
    }
  
    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver) return;
      timeout = setTimeout(() => {
        slider.next();
      }, 2500);
    }
  
    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clearNextTimeout();
      });
      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        nextTimeout();
      });
      nextTimeout();
    });
  
    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  }
  const [sliderRef,slider] = useKeenSlider({
    loop: true,
    slides: {
      perView: 3,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 1 },
      },
    },
  }, [AutoplayPlugin]);
  
  useEffect(() => {
      let interval
      if (slider.current) {
        interval = setInterval(() => {
          slider.current?.next()
        }, 3000) // Change every 3 seconds
      }
      return () => clearInterval(interval)
    }, [slider])
  // Fetch 9 featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productApi.getAll(); // Assuming API provides a way to get featured products
        setProducts(products.slice(0, 9)); // Limit to 9 products
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Handle adding product to cart
  const handleAddToCart = (product: Product) => {
    const updatedCart = [...cartItems, product];
    setCartItems(updatedCart);

    // You can save cart items to a database or localStorage here if needed
    // localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Welcome to Tech-Shop
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover our premium selection of products for all your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div className='bg-muted/50'>
<section  >
      {products.some(product => product.discountprice && product.discountprice > 0) && (
  <div className="my-6">
    <h2 className="text-xl font-bold mb-4">🔥 Discounted Products</h2>
    <div ref={sliderRef} className="keen-slider ">
      {products
        .filter(product => product.discountprice && product.discountprice > 0)
        .map((product, index) => (
          <div className="keen-slider__slide bg-white p-4 rounded-lg shadow" key={index}>
            <div key={product.id1}>
                <ProductCard product={product} />
                
              </div>
          </div>
        ))}
    </div>
  </div>
)}
</section>
{projects.length > 0 && (
        <section className="py-16 ">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Our Projects</h2>
              <Link to="/our-projects" className="text-primary flex items-center hover:underline">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id4}>
                <ProjectCard project={project} />
                
              </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary flex items-center hover:underline">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id1}>
                <ProductCard product={product} />
                
              </div>
            ))}
          </div>
        </div>
      </section>
      </div>
      {/* Info Sections */}
      <section className=" py-20 bg-muted/50 ">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Free Shipping</h3>
              <p className="text-muted-foreground">
                Enjoy free shipping on all orders over $50. Quick delivery to your doorstep.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-muted-foreground">
                Our customer service team is available round the clock to assist you.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
              <p className="text-muted-foreground">
                Shop with confidence with our encrypted and secure payment system.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;
