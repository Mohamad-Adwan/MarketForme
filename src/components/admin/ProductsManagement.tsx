
// import React from 'react';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { 
//   Pencil, 
//   Trash2, 
//   Plus,
//   Image,
//   Upload
// } from 'lucide-react';

// interface ProductsManagementProps {
//   products: Product[];
//   handleAddProduct: () => void;
//   handleEditProduct: (product: Product) => void;
//   handleDeleteProduct: (id: number) => void;
//   editingProduct: Product | null;
//   setEditingProduct: (product: Product | null) => void;
//   handleUpdateProduct: () => void;
//   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   selectedImage: File | null;
//   fileInputRef: React.RefObject<HTMLInputElement>;
//   handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const ProductsManagement: React.FC<ProductsManagementProps> = ({
//   products,
//   handleAddProduct,
//   handleEditProduct,
//   handleDeleteProduct,
//   editingProduct,
//   setEditingProduct,
//   handleUpdateProduct,
//   handleChange,
//   selectedImage,
//   fileInputRef,
//   handleImageChange
// }) => {
//   return (
//     <>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">Products Management</h2>
//         <Button onClick={handleAddProduct}>
//           <Plus className="h-4 w-4 mr-2" /> Add Product
//         </Button>
//       </div>
      
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>Product</TableHead>
//                 <TableHead>Category</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead>Stock</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {products.map((product) => (
//                 <TableRow key={product.id}>
//                   <TableCell>{product.id}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 flex-shrink-0">
//                         <img 
//                           src={product.image} 
//                           alt={product.name} 
//                           className="h-10 w-10 rounded-full object-cover"
//                         />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium">
//                           {product.name}
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>{product.category}</TableCell>
//                   <TableCell>${product.price.toFixed(2)}</TableCell>
//                   <TableCell>{product.stock}</TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       <Button 
//                         variant="ghost" 
//                         size="icon" 
//                         onClick={() => handleEditProduct(product)}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button 
//                         variant="ghost" 
//                         size="icon" 
//                         onClick={() => handleDeleteProduct(product.id)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {editingProduct && (
//         <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
//             <h3 className="text-xl font-bold mb-4">
//               {editingProduct.id === Math.max(...products.map(p => p.id)) 
//                 ? 'Add New Product' 
//                 : 'Edit Product'}
//             </h3>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Name
//                 </label>
//                 <Input
//                   name="name"
//                   value={editingProduct.name}
//                   onChange={handleChange}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Description
//                 </label>
//                 <Input
//                   name="description"
//                   value={editingProduct.description}
//                   onChange={handleChange}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Price
//                 </label>
//                 <Input
//                   name="price"
//                   type="number"
//                   value={editingProduct.price}
//                   onChange={handleChange}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Category
//                 </label>
//                 <Input
//                   name="category"
//                   value={editingProduct.category}
//                   onChange={handleChange}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Image
//                 </label>
//                 <div className="flex items-center gap-4">
//                   <div className="h-16 w-16 flex-shrink-0 border rounded overflow-hidden">
//                     <img 
//                       src={selectedImage ? URL.createObjectURL(selectedImage) : editingProduct.image} 
//                       alt={editingProduct.name} 
//                       className="h-full w-full object-cover"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <Input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       ref={fileInputRef}
//                       className="hidden"
//                     />
//                     <Button 
//                       type="button" 
//                       variant="outline" 
//                       className="w-full"
//                       onClick={() => fileInputRef.current?.click()}
//                     >
//                       <Upload className="h-4 w-4 mr-2" />
//                       {selectedImage ? 'Change Image' : 'Upload Image'}
//                     </Button>
//                     {selectedImage && (
//                       <p className="text-xs text-muted-foreground mt-1">
//                         {selectedImage.name}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Stock
//                 </label>
//                 <Input
//                   name="stock"
//                   type="number"
//                   value={editingProduct.stock}
//                   onChange={handleChange}
//                 />
//               </div>
              
//               <div className="flex justify-end space-x-3 pt-4">
//                 <Button 
//                   variant="outline" 
//                   onClick={() => setEditingProduct(null)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button onClick={handleUpdateProduct}>
//                   Save Changes
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProductsManagement;
// import React, { useState, useEffect, useRef } from 'react';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { productApi } from '@/services/apiService';

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   Pencil,
//   Trash2,
//   Plus,
//   Upload,
// } from 'lucide-react';


// interface ProductsManagementProps {
//   products: Product[];
// }

// const ProductsManagement: React.FC<ProductsManagementProps> = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Fetch products when the component is mounted
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await productApi.getAll();
//       setProducts(response.data);
//     } catch (error) {
//       console.error('Failed to fetch products', error);
//     }
//   };

//   // const handleAddProduct = () => {
//   //   setEditingProduct({
//   //     id: Math.max(...products.map((p) => p.id)) + 1,
//   //     name: '',
//   //     description: '',
//   //     price: 0,
//   //     category: '',
//   //     stock: 0,
//   //     image: '',
//   //   });
//   // };
//   const handleAddProduct = async () => {
//     if (!editingProduct) return;
  
//     // Convert image to base64 (if selectedImage is present)
//     let imageBase64 = '';
//     if (selectedImage) {
//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         imageBase64 = reader.result?.toString() || '';
  
//         // Prepare the updated product object with base64 image
//         const updatedProduct = {
//           ...editingProduct,
//           image: imageBase64,  // Set image as base64 string
//         };
  
//         try {
//           // Send the product object (including the base64 image) to the backend API
//           const response = await productApi.addProduct(updatedProduct);
  
//           // Handle success, update the product list or state as needed
//           setProducts(prevProducts => [...prevProducts, response.data]);
          
//           // Optionally reset the form or close modal
//           setEditingProduct(null);
//         } catch (error) {
//           console.error('Failed to add product:', error);
//         }
//       };
  
//       // Convert the image to base64
//       reader.readAsDataURL(selectedImage);
//     } else {
//       // If no image, send the product as is
//       const updatedProduct = {
//         ...editingProduct,
//         image: '',
//       };
  
//       try {
//         // Send the product object without an image
//         const response = await productApi.addProduct(updatedProduct);
  
//         // Handle success
//         setProducts(prevProducts => [...prevProducts, response.data]);
//         setEditingProduct(null);
//       } catch (error) {
//         console.error('Failed to add product:', error);
//       }
//     }
//   };
  
//   const handleEditProduct = (product: Product) => {
//     setEditingProduct(product);
//   };

//   const handleDeleteProduct = async (id: number) => {
//     try {
//       await productApi.deleteProduct(editingProduct.id);
//       setProducts(products.filter((product) => product.id !== id));
//     } catch (error) {
//       console.error('Failed to delete product', error);
//     }
//   };

//   const handleUpdateProduct = async () => {
//     if (!editingProduct) return;
  
//     // Prepare the updated product object
//     const updatedProduct: Product = {
//       ...editingProduct,
//       // Only update fields that have changed
//       name: editingProduct.name || '',
//       description: editingProduct.description || '',
//       price: editingProduct.price || 0,
//       category: editingProduct.category || '',
//       stock: editingProduct.stock || 0,
//     };
  
//     // If there's a selected image, convert it to a base64 string
//     if (selectedImage) {
//       const reader = new FileReader();
//       reader.readAsDataURL(selectedImage);
  
//       reader.onloadend = async () => {
//         updatedProduct.image = reader.result as string; // Base64 string of the image
  
//         try {
//           // Call the updateProduct function and pass the updatedProduct
//           await productApi.updateProduct(editingProduct.id, updatedProduct);
  
//           // After successful update, update the local products list in state
//           setProducts(prevProducts => 
//             prevProducts.map(product => 
//               product.id === updatedProduct.id ? updatedProduct : product
//             )
//           );
  
//           // Optionally close the edit modal and reset the editing state
//           setEditingProduct(null);
//         } catch (error) {
//           console.error('Failed to update product:', error);
//         }
//       };
//     } else {
//       // If no image selected, just update the product without the image
//       try {
//         await productApi.updateProduct(editingProduct.id, updatedProduct);
  
//         // After successful update, update the local products list in state
//         setProducts(prevProducts => 
//           prevProducts.map(product => 
//             product.id === updatedProduct.id ? updatedProduct : product
//           )
//         );
  
//         // Optionally close the edit modal and reset the editing state
//         setEditingProduct(null);
//       } catch (error) {
//         console.error('Failed to update product:', error);
//       }
//     }
//   };
  

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (editingProduct) {
//       setEditingProduct({
//         ...editingProduct,
//         [e.target.name]: e.target.value,
//       });
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setSelectedImage(e.target.files[0]);
//     }
//   };

//   return (
//     <>
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold">Products Management</h2>
//         <Button onClick={handleAddProduct}>
//           <Plus className="h-4 w-4 mr-2" /> Add Product
//         </Button>
//       </div>

//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ID</TableHead>
//                 <TableHead>Product</TableHead>
//                 <TableHead>Category</TableHead>
//                 <TableHead>Price</TableHead>
//                 <TableHead>Stock</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {products.map((product) => (
//                 <TableRow key={product.id}>
//                   <TableCell>{product.id}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center">
//                       <div className="h-10 w-10 flex-shrink-0">
//                         {/* <img
//                           src={product.image}
//                           alt={product.name}
//                           className="h-10 w-10 rounded-full object-cover"
//                         /> */}
//                         <img
//                         src={typeof product.image === 'string' ? product.image : URL.createObjectURL(product.image)}
//                         alt={product.name}
//                         className="h-10 w-10 rounded-full object-cover"
//                       />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium">
//                           {product.name}
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>{product.category}</TableCell>
//                   <TableCell>${product.price.toFixed(2)}</TableCell>
//                   <TableCell>{product.stock}</TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleEditProduct(product)}
//                       >
//                         <Pencil className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleDeleteProduct(product.id)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {editingProduct && (
//         <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
//             <h3 className="text-xl font-bold mb-4">
//               {editingProduct.id === Math.max(...products.map((p) => p.id))
//                 ? 'Add New Product'
//                 : 'Edit Product'}
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Name
//                 </label>
//                 <Input
//                   name="name"
//                   value={editingProduct.name}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Description
//                 </label>
//                 <Input
//                   name="description"
//                   value={editingProduct.description}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Price
//                 </label>
//                 <Input
//                   name="price"
//                   type="number"
//                   value={editingProduct.price}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Category
//                 </label>
//                 <Input
//                   name="category"
//                   value={editingProduct.category}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Image
//                 </label>
//                 <div className="flex items-center gap-4">
//                   <div className="h-16 w-16 flex-shrink-0 border rounded overflow-hidden">
//                     {/* <img
//                       src={
//                         selectedImage
//                           ? URL.createObjectURL(selectedImage)
//                           : editingProduct.image
//                       }
//                       alt={editingProduct.name}
//                       className="h-full w-full object-cover"
//                     /> */}
//                     <img
//                       src={
//                         selectedImage
//                           ? URL.createObjectURL(selectedImage)  // Create object URL from File
//                           : typeof editingProduct.image === 'string'
//                           ? editingProduct.image  // Use the string URL directly
//                           : ''  // Fallback if image is of type File
//                       }
//                       alt={editingProduct.name}
//                       className="h-full w-full object-cover"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <Input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       ref={fileInputRef}
//                       className="hidden"
//                     />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       className="w-full"
//                       onClick={() => fileInputRef.current?.click()}
//                     >
//                       <Upload className="h-4 w-4 mr-2" />
//                       {selectedImage ? 'Change Image' : 'Upload Image'}
//                     </Button>
//                     {selectedImage && (
//                       <p className="text-xs text-muted-foreground mt-1">
//                         {selectedImage.name}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-muted-foreground mb-1">
//                   Stock
//                 </label>
//                 <Input
//                   name="stock"
//                   type="number"
//                   value={editingProduct.stock}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="flex justify-end space-x-3 pt-4">
//                 <Button variant="outline" onClick={() => setEditingProduct(null)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={handleUpdateProduct}>Save Changes</Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProductsManagement;
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
