
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get cart
router.get('/:userId', cartController.getCart);

// Add to cart
router.post('/:userId', cartController.addToCart);

// Update cart item
router.put('/:userId/item/:id1', cartController.updateCartItem);

// Remove from cart
router.delete('/:userId/item/:id1', cartController.removeFromCart);

// Clear cart
router.delete('/clear/:userId', cartController.clearCart);
module.exports = router;
