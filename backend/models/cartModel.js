
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
