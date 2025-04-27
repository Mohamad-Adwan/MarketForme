
import React, { useEffect, useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { globalApi, productApi } from '@/services/apiService'; // Your API module
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

interface ProductsManagementProps {
  products: Product[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (id: number) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedImage: File | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  // handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductsManagement: React.FC<ProductsManagementProps> = ({
  products,
  handleEditProduct,
  editingProduct,
  setEditingProduct,
  handleChange,
  // selectedImage,
  fileInputRef,
  // handleImageChange,
}) => {
 // const [product, setProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [product, setProducts] = useState([]);
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

  const toggle = async () => {
    const newStatus = !isOnoff;
    setisOnOff(newStatus);

    try {
      await globalApi.setStatus(newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Optional: Upload it here
      // uploadFile(file);
    }
  };
  // Add Product Logic
  const handleAddProduct = async () => {
    const newProduct: Product = {
      id1: 0, // We'll let the server handle ID
      name: '',
      description: '',
      price: 0,
      image: ' ',
      category: '',
      stock: 0,
      discountprice:0,
      
    };

    setEditingProduct(newProduct); // Set the form to empty values
  };

  // Handle the form submission for adding or updating
  const handleSaveProduct = async () => {
    if (!editingProduct) {
      toast.error('No product selected for save');
      return;
    }

    try {
      const formData = new FormData();
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    for (const key in editingProduct) {
      if (Object.prototype.hasOwnProperty.call(editingProduct, key)) {
        formData.append(key, editingProduct[key]);
      }
    }
      // const uploadedImageUrl = selectedImage;

      // if (selectedImage) {
      //   const formData = new FormData();
      //   formData.append('image', selectedImage);
      //   const uploadedImage = await productApi.uploadImage(formData);
      //   uploadedImageUrl = uploadedImage.url;
      // }

      // const updatedProduct = {
      //   ...editingProduct,
      //   image: uploadedImageUrl,
      // };

      // if (updatedProduct.id1 === 0) {
      //   // Add Product
      //   const addedProduct = await productApi.addProduct(updatedProduct);
      //   setProducts((prevProducts) => [...prevProducts, addedProduct]);
      //   toast.success('Product added successfully');
      // } else {
      //   // Update Product
      //   await productApi.updateProduct(updatedProduct.id1, updatedProduct);
      //   setProducts((prevProducts) =>
      //     prevProducts.map((p) => (p.id1 === updatedProduct.id1 ? updatedProduct : p))
      //   );
      //   toast.success('Product updated successfully');
      // }
      if (editingProduct.id1 === 0) {
        // Add Product
        const addedProduct = await productApi.addProduct(formData); // <-- pass formData
        setProducts((prevProducts) => [...prevProducts, addedProduct]);
        toast.success('Product added successfully');
      } else {
        // Update Product (you may need to handle this separately)
        await productApi.updateProduct(editingProduct.id1, formData);
        
        toast.success('Product updated successfully');
      }

      setEditingProduct(null); // Reset form after save

    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await productApi.deleteProduct(id);
      setProducts(product.filter((product) => product.id1 !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Failed to delete product', error);
      toast.error('Failed to delete product');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productApi.getAll();
        console.log('Fetched products:', data);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="flex gap-3">
        <div className="flex items-center gap-3">
        <span className="text-lg font-semibold">Price Status</span>
        <button
          onClick={toggle}
          className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 ease-in-out
            ${isOnoff ? 'bg-green-500' : 'bg-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer active:scale-95`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
              isOnoff ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
        <Button onClick={handleAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
             
              </div>
              </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Discount price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.map((product) => (
              <TableRow key={product.id1}>
                <TableCell>{product.id1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}₪</TableCell>
                <TableCell>{product.discountprice}₪</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.stock}</TableCell>
                
                <TableCell>
                    
                  <img
                  
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-white hover:bg-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          Confirm Deletion
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete user {product.name}? This will also delete all their orders and cart items. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteProduct(product.id1)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for editing/adding product */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] relative space-y-4">
            <h3 className="text-xl font-semibold mb-4">
              {editingProduct.id1 ? 'Edit Product' : 'Add Product'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Name
                </label>
                <Input
                  name="name"
                  value={editingProduct.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Description
                </label>
                <Input
                  name="description"
                  value={editingProduct.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Price
                </label>
                <Input
                  name="price"
                  type="number"
                  value={editingProduct.price}
                  onChange={handleChange}
                  placeholder="Price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                Discount price
                </label>
                <Input
                  name="discountprice"
                  type="number"
                  value={editingProduct.discountprice}
                  onChange={handleChange}
                  placeholder="Discount Price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Category
                </label>
                <Input
                  name="category"
                  value={editingProduct.category}
                  onChange={handleChange}
                  placeholder="Category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Stock
                </label>
              <Input
                name="stock"
                type="number"
                value={editingProduct.stock}
                onChange={handleChange}
                placeholder="Stock"
              />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => fileInputRef.current.click()}>
                <Upload className="w-4 h-4 mr-1" />
                Upload Image
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              {selectedImage && (
                <span className="text-sm text-gray-500">
                  {selectedImage.name}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
