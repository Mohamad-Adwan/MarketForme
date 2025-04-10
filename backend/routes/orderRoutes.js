
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Get all orders (admin only)
router.get('/', orderController.getAllOrders);
// // Get user orders

 router.get('/order/:userId', orderController.getOrders);
router.get('/detail/:orderId', orderController.getOrderById);
router.get('/Dasdashboard',orderController.getDashboard);


// // Create order
router.post('/', orderController.createOrder);

// // Get order details
// Get order details by orderId

// // Update order status (admin only)
router.put('/status/:orderId', orderController.updateOrderStatus);
router.put('/edit/item/:itemId', orderController.edititemQuantity);
// // Delete order (admin only)
router.delete('/:orderId', orderController.deleteOrder);
router.delete('/item/:itemId', orderController.deleteitem);

// When implementing async/await, you may want to use an errorHandler wrapper
// Uncomment this when using a real database
/*
// Error handling wrapper for async routes
const asyncHandler = fn => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Example of using asyncHandler with async controller methods
// router.get('/', asyncHandler(orderController.getAllOrders));
// router.post('/', asyncHandler(orderController.createOrder));
// router.get('/:userId', asyncHandler(orderController.getUserOrders));
// router.get('/detail/:orderId', asyncHandler(orderController.getOrderById));
// router.put('/status/:orderId', asyncHandler(orderController.updateOrderStatus));
// router.delete('/:orderId', asyncHandler(orderController.deleteOrder));
*/

module.exports = router;
