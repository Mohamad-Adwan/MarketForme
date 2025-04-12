
// const db = require('./db');

// const cartModel = {
//   getCart: (userId) => {
//     return db.carts[userId] || { items: [] };
//   },
  
//   addToCart: (userId, productId, quantity) => {
//     // Initialize cart if it doesn't exist
//     if (!db.carts[userId]) {
//       db.carts[userId] = { items: [] };
//     }
    
//     const cartItems = db.carts[userId].items;
//     const existingItem = cartItems.find(item => item.id === productId);
    
//     if (existingItem) {
//       existingItem.quantity = quantity;
//     } else {
//       const product = db.products.find(p => p.id === productId);
//       cartItems.push({
//         ...product,
//         quantity
//       });
//     }
    
//     return db.carts[userId];
//   },
  
//   updateCartItem: (userId, productId, quantity) => {
//     if (!db.carts[userId]) return null;
    
//     const cartItems = db.carts[userId].items;
//     const itemIndex = cartItems.findIndex(item => item.id === parseInt(productId));
    
//     if (itemIndex === -1) return null;
    
//     cartItems[itemIndex].quantity = quantity;
    
//     return db.carts[userId];
//   },
  
//   removeFromCart: (userId, productId) => {
//     if (!db.carts[userId]) return null;
    
//     const cartItems = db.carts[userId].items;
//     const productIdNum = parseInt(productId);
//     db.carts[userId].items = cartItems.filter(item => item.id !== productIdNum);
    
//     return db.carts[userId];
//   },
  
//   clearCart: (userId) => {
//     db.carts[userId] = { items: [] };
//     return db.carts[userId];
//   }
// };

// module.exports = cartModel;
const mongoose = require('mongoose');

// Define the schema for order items

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      id1: String, // or id1
      quantity: Number,
      price: Number,
      image: {
        data: Buffer,
        contentType: String,
        FileName: String,
      },
      itemname:String,
    }
  ]
}, );

// Create the OrderItem model based on the schema
const cartItem = mongoose.model('OrderItem', cartSchema);

module.exports = cartItem;
