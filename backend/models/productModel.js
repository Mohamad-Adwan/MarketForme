
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const path = require('path');

// Create a GridFS stream instance
const conn = mongoose.connection;


const productSchema = new mongoose.Schema({
  id1: { type: Number,unique: true }, // Auto-increment field
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountprice:{type:Number},
  description: String,
  stock: Number,
  category: String,
  featured: Boolean,
 // image: { type: String }, // Store the image as binary data (Buffer)
  image: {
    data: Buffer,
    contentType: String,
    FileName: String,
  },
  // imagePath: { type: String }, // Store the path to the image file
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Add auto-increment plugin to schema
productSchema.plugin(AutoIncrement, { inc_field: 'id1' , counter_name: 'product_counter' });

const Product = mongoose.model('Product', productSchema);


  // Pipe the file data into GridFS

 
 

module.exports = { Product };

