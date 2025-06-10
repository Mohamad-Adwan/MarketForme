
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import {  projectApi } from '@/services/apiService';
import { Project } from '@/types';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
   const [Project, setProject] = useState<Project | null>(null);
  useEffect(() => {
      const fetchCartItems = async () => {
        try {
          const items = await projectApi.getProjectById(Number(id)); // Assuming this fetches Projects
          setProject(items);
        } catch (error) {
          console.error('Failed to fetch cart items:', error);
        }
      };
      fetchCartItems();
    }, []);
  if (!Project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <Link to="/our-projects">
            <Button>Return to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/our-projects" className="flex items-center text-primary mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Projects
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Project Image */}
        {/* <div className="aspect-square overflow-hidden rounded-lg"> */}
        <div className=" overflow-hidden rounded-lg">
          <img 
            src={Project.image} 
            alt={Project.name} 
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"          />
        </div>
        
        {/* Project Details */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{Project.name}</h1>
           
          </div>
          

          
          <div className="pt-2">
            <h3 className="text-lg font-medium mb-2">Description:</h3>
            <p className="text-muted-foreground">
              {Project.description}
            </p>
          </div>
          
          
          
          
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
