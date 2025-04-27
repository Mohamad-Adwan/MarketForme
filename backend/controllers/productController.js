
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

  
  addProduct: async (req, res) => {
    try {
      const productData = req.body;
  const  file  = req.file;
  const fileBinary = new mongodb.Binary(file.buffer);
     
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
