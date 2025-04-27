
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');


const upload = multer({storage: multer.memoryStorage()});

router.get('/Dasdashboard', productController.getDashboard);
// Get all products
router.get('/', productController.getAllProducts);

// Get a product by ID
router.get('/:id1', productController.getProductById);

// Get featured products
router.get('/featured', productController.getFeaturedProducts);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

// Upload product image (admin only)
// router.post('/upload-image', productController.uploadImage);

// Add new product (admin only)
router.post('/', upload.single('image'), productController.addProduct);

// Update product (admin only)
// router.put('/:id1', productController.updateProduct);
router.put('/:id1',upload.single('image'), productController.updateProduct);
// Delete product (admin only)
router.delete('/:id1', productController.deleteProduct);

module.exports = router;
