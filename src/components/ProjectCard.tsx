
import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

import { Project } from '@/types';
import { Button } from './ui/button';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';


interface ProjectCardProps {
  project: Project;
}

const ProductCard: React.FC<ProjectCardProps> = ({ project }) => {
  
  
  return (
    <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md flex flex-col">
      <div className="relative h-48 overflow-hidden">
        {/* {product.featured && (
          <Badge className="absolute top-2 left-2 z-10">Featured</Badge>
        )} */}
        <img 
          src={project.image} 
          alt={project.name} 
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardContent className="pt-4 flex-grow">
        <h3 className="font-medium text-lg tracking-tight">{project.name}</h3>
       <div className="flex gap-2 w-full mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1" 
            asChild
          >
            <Link to={`/projects/${project.id4}`}>
              <Eye className="h-4 w-4 mr-1" /> Details
            </Link>
          </Button>
          </div>
        </CardContent>
    </Card>
  );
};

export default ProductCard;
