import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectApi } from '@/services/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { Button } from '../../src/components/ui/button';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const OurProjectsPage = () => {
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Our Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 mb-2" />
                <Skeleton className="h-4 mb-2" />
                <Skeleton className="h-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Our Projects</h1>
          <p className="text-muted-foreground">Unable to load projects at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Projects</h1>
      
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No projects available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
          ))}
        </div>
      )}
    </div>
  );
};

export default OurProjectsPage;
