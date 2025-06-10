import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectApi } from '@/services/apiService';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { set } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

const ProjectsManagement = () => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState([]);

 useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await projectApi.getAll();
        console.log('Fetched products:', data);
        setProjects(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);
  const handleAddProject = () => {
    const newProject: Project = {
      id4: 0,
      name: '',
      description: '',
      image: '',
    //   featured: false,
    };
    setEditingProject(newProject);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject({ ...project });
    setIsDialogOpen(true);
  };

  const handleSaveProject = async () => {
    if (!editingProject) return;

    try {
       const formData = new FormData();
if (selectedImage) {
  formData.append('image', selectedImage);
}
for (const key in editingProject) {
  if (
    Object.prototype.hasOwnProperty.call(editingProject, key) &&
    key !== 'image' // <-- skip image key here
  ) {
    formData.append(key, editingProject[key]);
  }
}
  // ...existing code...

// ...existing code...
      // let imageUrl = editingProject.image;

      // if (selectedImage) {
      //   const formData = new FormData();
      //   formData.append('image', selectedImage);
      //   const uploadResponse = await projectApi.uploadImage(formData);
      //   imageUrl = uploadResponse.imageUrl;
      // }

      // const projectData = { ...editingProject, image: imageUrl };

      if (editingProject.id4 === 0) {
        const addedProject = await projectApi.addProject(formData);

setProjects((prev) => [...prev, addedProject.project]);
        toast.success('Project added successfully');
      } else {
        await projectApi.updateProject(editingProject.id4, formData);
       setProjects((prev) =>
  prev.map((project) =>
    project.id4 === editingProject.id4
      ? { ...editingProject }  // Replace with updated one
      : project                // Keep existing
  )
);

        
        toast.success('Project updated successfully');
      }

  
      setIsDialogOpen(false);
      setEditingProject(null);
      setSelectedImage(null);
    } catch (error) {
      toast.error('Failed to save project');
      console.error('Error saving project:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {

    try {
      await projectApi.deleteProject(id);
   setProjects((prev) => prev.filter((project) => project.id4 !== id));

      toast.success('Project deleted successfully');
     
    } catch (error) {
      toast.error('Failed to delete project');
      console.error('Error deleting project:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects Management</h2>
        <Button onClick={handleAddProject}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          { (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  {/* <TableHead>Featured</TableHead> */}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{project.description}</TableCell>
                    {/* <TableCell>
                      {project.featured ? (
                        <Badge variant="default">Featured</Badge>
                      ) : (
                        <Badge variant="secondary">Not Featured</Badge>
                      )}
                    </TableCell> */}
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                      {/* <AlertDialogTrigger asChild> */}
                       <AlertDialogTrigger >
                        <Button
                          variant="destructive"
                          size="sm"
                          
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                       <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete user {project.name}? This will also delete all their orders and cart items. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProject(project.id4)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                   </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProject?.id4 === 0 ? 'Add New Project' : 'Edit Project'}
            </DialogTitle>
            <DialogDescription>
              Fill in the project details below.
            </DialogDescription>
          </DialogHeader>

          {editingProject && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={editingProject.name}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, name: e.target.value })
                  }
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image">Project Image</Label>
                <div className="flex items-center space-x-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {selectedImage ? selectedImage.name : 'Choose Image'}
                  </Button>
                </div>
                {editingProject.image && !selectedImage && (
                  <img
                    src={editingProject.image}
                    alt="Current"
                    className="mt-2 w-20 h-20 object-cover rounded"
                  />
                )}
              </div>

              {/* <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={editingProject.featured}
                  onCheckedChange={(checked) =>
                    setEditingProject({ ...editingProject, featured: checked })
                  }
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div> */}

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleSaveProject} className="flex-1">
                  {editingProject.id4 === 0 ? 'Add Project' : 'Update Project'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsManagement;