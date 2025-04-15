
// const productModel = require('../models/productModel');
// const fs = require('fs');
// const path = require('path');

// const productController = {
//   getAllProducts: (req, res) => {
//     const products = productModel.getAllProducts();
//     res.json(products);
//   },
  
//   getProductById: (req, res) => {
//     const product = productModel.getProductById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });
//     res.json(product);
//   },
  
//   getFeaturedProducts: (req, res) => {
//     const featuredProducts = productModel.getFeaturedProducts();
//     res.json(featuredProducts);
//   },
  
//   getProductsByCategory: (req, res) => {
//     const categoryProducts = productModel.getProductsByCategory(req.params.category);
//     res.json(categoryProducts);
//   },
  
//   uploadImage: (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//       }
      
//       // Create the uploads directory if it doesn't exist
//       const uploadsDir = path.join(__dirname, '..', 'uploads');
//       if (!fs.existsSync(uploadsDir)) {
//         fs.mkdirSync(uploadsDir, { recursive: true });
//       }
      
//       // In a real application, you might want to process the image,
//       // e.g., resize it, compress it, etc.
      
//       // Construct the URL to the uploaded file
//       const baseUrl = `${req.protocol}://${req.get('host')}`;
//       const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      
//       res.json({ 
//         success: true, 
//         imageUrl: imageUrl,
//         originalName: req.file.originalname,
//         size: req.file.size
//       });
//     } catch (error) {
//       console.error('Image upload error:', error);
//       res.status(500).json({ error: 'Failed to upload image' });
//     }
//   },

//   // Add new product
//   addProduct: (req, res) => {
//     try {
//       const productData = req.body;
//       if (!productData.name || !productData.price) {
//         return res.status(400).json({ error: 'Name and price are required' });
//       }
      
//       const newProduct = productModel.addProduct(productData);
//       res.status(201).json(newProduct);
//     } catch (error) {
//       console.error('Add product error:', error);
//       res.status(500).json({ error: 'Failed to add product' });
//     }
//   },
  
//   // Update product
//   updateProduct: (req, res) => {
//     try {
//       const { id } = req.params;
//       const productData = req.body;
      
//       const updatedProduct = productModel.updateProduct(id, productData);
//       if (!updatedProduct) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
      
//       res.json(updatedProduct);
//     } catch (error) {
//       console.error('Update product error:', error);
//       res.status(500).json({ error: 'Failed to update product' });
//     }
//   },
  
//   // Delete product
//   deleteProduct: (req, res) => {
//     try {
//       const { id } = req.params;
//       const result = productModel.deleteProduct(id);
      
//       if (!result) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
      
//       res.json({ success: true, message: 'Product deleted successfully' });
//     } catch (error) {
//       console.error('Delete product error:', error);
//       res.status(500).json({ error: 'Failed to delete product' });
//     }
//   }
// };

// module.exports = productController;
const { Product } = require('../models/productModel');
const  Order  = require('../models/orderModel');
const  User  = require('../models/userModel');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Setup multer to handle file uploads
const storage = multer.memoryStorage();  // Store file in memory
const upload = multer({ storage: storage }).single('image');  // Accept single file upload
// Controller for handling product-related actions
const productController = {
  // uploadImage :(req, res) => {
  //   try {
  //     if (!req.file) {
  //       return res.status(400).json({ error: 'No file uploaded' });
  //     }
  
  //     const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  //     res.status(200).json({ url: imageUrl });
  //   } catch (err) {
  //     console.error('Image upload failed:', err);
  //     res.status(500).json({ error: 'Failed to upload image' });
  //   }
  // },
  // addProduct : async (req, res) => {
  //   try {
  //     const newProduct = await Product.create(req.body); // For MongoDB/Mongoose or use INSERT for SQL
  //     res.status(201).json(newProduct);
  //   } catch (err) {
  //     console.error('Error adding product:', err);
  //     res.status(500).json({ error: 'Failed to add product' });
  //   }
  // },
  
  // Update a product
  // updateProduct : async (req, res) => {
  //   const { id } = req.params;
  //   const productData = req.body;
  //   const  file  = req.file;
  //   const fileBinary = new mongodb.Binary(file.buffer);
  //   try {
  //     const updatedProduct = await Product.findByIdAndUpdate({id:id1}, req.body, { new: true }); // MongoDB
  //     if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
  
  //     res.status(200).json(updatedProduct);
  //   } catch (err) {
  //     console.error('Error updating product:', err);
  //     res.status(500).json({ error: 'Failed to update product' });
  //   }
  // },
  updateProduct :async (req, res) => {
    const { id1 } = req.params; // This is the MongoDB _id
    const productData = req.body;
    const file = req.file;
      isUpdated = false;
    try {
     
      // If there's a new image file uploaded, add it to the update fields
      if(file) {
      const updatedProduct = await Product.findOneAndUpdate(
        {id1:id1},
        {
          image: {
            data: file.buffer,
            contentType: file.mimetype,
            FileName: file.originalname
          },
          name: productData.name,
          price: productData.price,
          discountprice:productData.discountprice,
          description: productData.description,
          stock: productData.stock,
          category: productData.category,
         
        },
        { new: true }
      );
      isUpdated = true;
    }
    else {
      const updatedProduct = await Product.findOneAndUpdate(
        { id1: id1 }, // If you're using custom `id`, keep this. Otherwise, use `_id`.
        {
          name: productData.name,
          price: productData.price,
          description: productData.description,
          stock: productData.stock,
          discountprice:productData.discountprice,
          category: productData.category,
        },
        { new: true } // Return the updated document
      );
      isUpdated = true;
    }
  
      if (!isUpdated) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json(isUpdated);
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Failed to update product' });
    }
  },
  
  getDashboard: async (req, res) => {
    try {
      
      const products = await Product.find();
      console.log('Users:', products);

      
      const totalProducts = products.length;
     
  
     
      
      res.json({
        
        totalProducts,
       
      });
    } catch (error) {
      console.error('Error fetching dashboard info:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard info' });
    }
  },  
  // 1. Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
  
      const productsWithBase64Images = products.map((product) => {
        const base64Image =
          product.image && product.image.data && Buffer.isBuffer(product.image.data)
            ? `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`
            : null;
      
        return {
          id1: product.id1,
          name: product.name,
          price: product.price,
          discountprice:product.discountprice,
          description: product.description,
          stock: product.stock,
          category: product.category,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          image: base64Image, // Now it's a clean string
        };
      });
      // console.log('Products:', productsWithBase64Images);
      res.status(200).json(productsWithBase64Images);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
  ,  
  

  // 2. Get product by ID
  getProductById: async (req, res) => {
    const { id1 } = req.params;
    try {
      const product = await Product.findOne({id1:id1}); // or however you fetch it

if (!product) {
  return res.status(404).json({ error: 'Product not found' });
}

const base64Image =
  product.image && product.image.data && Buffer.isBuffer(product.image.data)
    ? `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`
    : null;

const formattedProduct = {
  id1: product.id1,
  name: product.name,
  price: product.price,
  discountprice:product.discountprice,
  description: product.description,
  stock: product.stock,
  category: product.category,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
  image: base64Image,
};

res.status(200).json(formattedProduct);

    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
  ,  

  // 3. Get featured products
  getFeaturedProducts: async (req, res) => {
    try {
      const featuredProducts = await Product.find({ featured: true }).populate('image');
      res.status(200).json(featuredProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      res.status(500).json({ error: 'Failed to fetch featured products' });
    }
  },

  // 4. Get products by category
  getProductsByCategory: async (req, res) => {
    const { category } = req.params;
    try {
      const productsByCategory = await Product.find({ category }).populate('image');
      res.status(200).json(productsByCategory);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({ error: 'Failed to fetch products by category' });
    }
  },

  // 5. Upload product image (admin only)
  //  uploadImage : async (req, res) => {
  //   try {
  //     const file = req.file; // The file is available in req.file
  //     if (!file) {
  //       return res.status(400).json({ error: 'No file uploaded' });
  //     }
  
  //     // Save the image to your database or storage (GridFS, S3, etc.)
  //     const imageBuffer = file.buffer; // Use the buffer data to store the image
      
  //     // Assuming you're saving to GridFS or similar
  //     const gridfsStream = conn.db.collection('fs.files');
  //     const writeStream = gridfsStream.openUploadStream(file.originalname);
  
  //     writeStream.end(imageBuffer);
  //     writeStream.on('finish', () => {
  //       res.status(200).json({ url: '/path/to/uploaded/image' });
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Failed to upload image' });
  //   }
  // },

  // // 6. Add new product (admin only)
  // addProduct: async (req, res) => {
  //   try {
  //     const productData = req.body;

  //     // If an image was uploaded, store its GridFS file ID
  //     if (req.body.image) {
  //       productData.image = req.body.image;  // Assuming image is the GridFS file ID
  //     }

  //     const newProduct = new Product(productData);
  //     await newProduct.save();

  //     res.status(201).json({
  //       success: true,
  //       product: newProduct,
  //     });
  //   } catch (error) {
  //     console.error('Error adding product:', error);
  //     res.status(500).json({ error: 'Failed to add product' });
  //   }
  // },
  addProduct: async (req, res) => {
    try {
      const productData = req.body;
  const  file  = req.file;
  const fileBinary = new mongodb.Binary(file.buffer);
      // If an image is provided as a base64 string, convert it to a Buffer
      // if (productData.image && productData.image.startsWith('data:image')) {
      //   // Assuming the image is a base64 encoded string, extract the actual data part
      //   const matches = productData.image.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)$/);
      //   if (matches && matches.length === 3) {
      //     const imageBuffer = Buffer.from(matches[2], 'base64');
      //     productData.image = imageBuffer;  // Store image as binary Buffer
      //   }
      // }
  if (file) {
const fileDocument = {
  data: fileBinary,
  contentType: file.mimetype,
  FileName: file.originalname,
};
    productData.image = fileDocument; // Store the image as binary data
  } 

      // Create a new product instance using the product data
      const newProduct = new Product(productData);
  
      // Save the new product to the database
      await newProduct.save();
  
      // Respond with the created product data
      res.status(201).json({
        success: true,
        product: newProduct,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Failed to add product' });
    }
  },
  // // 7. Update product (admin only)
  // updateProduct: async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const updatedProduct = await Product.findOneAndUpdate(
  //       { id },
  //       req.body,
  //       { new: true }  // Return the updated document
  //     );
  //     if (!updatedProduct) {
  //       return res.status(404).json({ error: 'Product not found' });
  //     }
  //     res.status(200).json(updatedProduct);
  //   } catch (error) {
  //     console.error('Error updating product:', error);
  //     res.status(500).json({ error: 'Failed to update product' });
  //   }
  // },
  // 7. Update product (admin only)
  // updateProduct: async (req, res) => {
  //   const { id1 } = req.params;
  //   try {
  //     // Check if the body has an image and handle it accordingly
  //     if (req.file) {
  //       // If the image is part of the request (uploaded using FormData), we need to handle it separately
  //       const imageBuffer = req.file.buffer; // Assuming you are using multer to handle file uploads
  
  //       // You can convert imageBuffer to base64 or save it to the file system, depending on your use case
  //       // Example: Save it as base64 (optional, depending on your requirement)
  //       req.body.image = imageBuffer.toString('base64');
  //       // Or, if you want to save it as a file path:
  //       // const imagePath = 'path/to/uploaded/image.jpg';
  //       // req.body.image = imagePath;
  //     }
  
  //     // Use Mongoose to find and update the product
  //     const updatedProduct = await Product.findOneAndUpdate(
  //       { id1:req.params.id1 },  // If you're using custom `id`, keep this. Otherwise, use `_id`.
  //       req.body, // Update with the request body
  //       { new: true } // Return the updated document
  //     );
  
  //     // If the product is not found, return a 404 error
  //     if (!updatedProduct) {
  //       return res.status(404).json({ error: 'Product not found' });
  //     }
  
  //     // Return the updated product data
  //     res.status(200).json(updatedProduct);
  //   } catch (error) {
  //     console.error('Error updating product:', error);
  //     res.status(500).json({ error: 'Failed to update product' });
  //   }
  // }
  
  // 8. Delete product (admin only)
  deleteProduct: async (req, res) => {
    const { id1 } = req.params;
    try {
      const deletedProduct = await Product.findOneAndDelete({ id1: id1 });
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  },
};

module.exports = productController;
