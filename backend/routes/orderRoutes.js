
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
router.post('/guest', orderController.createOrderGuest);

// // Get order details
// Get order details by orderId

// // Update order status (admin only)
router.put('/status/:orderId', orderController.updateOrderStatus);
router.put('/edit/item/:itemId', orderController.edititemQuantity);
// // Delete order (admin only)
router.delete('/:orderId', orderController.deleteOrder);
router.delete('/item/:itemId', orderController.deleteitem);
router.post('/track', orderController.trackOrderByPhone);


module.exports = router;
