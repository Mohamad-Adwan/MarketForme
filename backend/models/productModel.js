
// const db = require('./db');

// const productModel = {
//   getAllProducts: () => {
//     return db.products;
//   },
  
//   getProductById: (id) => {
//     return db.products.find(p => p.id === parseInt(id));
//   },
  
//   getFeaturedProducts: () => {
//     return db.products.filter(p => p.featured);
//   },
  
//   getProductsByCategory: (category) => {
//     return db.products.filter(p => p.category === category);
//   },

//   // Add new product
//   addProduct: (productData) => {
//     const newId = Math.max(...db.products.map(p => p.id)) + 1;
//     const newProduct = {
//       id: newId,
//       ...productData
//     };
//     db.products.push(newProduct);
//     return newProduct;
    
//     /* Uncomment this when using a real database
//     return new Promise((resolve, reject) => {
//       // MySQL example
//       const query = 'INSERT INTO products SET ?';
//       pool.query(query, [productData], (err, result) => {
//         if (err) return reject(err);
//         resolve({
//           id: result.insertId,
//           ...productData
//         });
//       });
      
//       // MongoDB example
//       // const collection = dbConnection.collection('products');
//       // collection.insertOne(productData)
//       //   .then(result => resolve({ id: result.insertedId, ...productData }))
//       //   .catch(err => reject(err));
//     });
//     */
//   },
  
//   // Update product
//   updateProduct: (id, productData) => {
//     const index = db.products.findIndex(p => p.id === parseInt(id));
//     if (index === -1) return null;
    
//     const updatedProduct = {
//       ...db.products[index],
//       ...productData
//     };
//     db.products[index] = updatedProduct;
//     return updatedProduct;
    
//     /* Uncomment this when using a real database
//     return new Promise((resolve, reject) => {
//       // MySQL example
//       const query = 'UPDATE products SET ? WHERE id = ?';
//       pool.query(query, [productData, id], (err, result) => {
//         if (err) return reject(err);
//         if (result.affectedRows === 0) return resolve(null);
//         resolve({ id: parseInt(id), ...productData });
//       });
      
//       // MongoDB example
//       // const collection = dbConnection.collection('products');
//       // collection.updateOne({ _id: id }, { $set: productData })
//       //   .then(result => {
//       //     if (result.matchedCount === 0) return resolve(null);
//       //     resolve({ id, ...productData });
//       //   })
//       //   .catch(err => reject(err));
//     });
//     */
//   },
  
//   // Delete product
//   deleteProduct: (id) => {
//     const index = db.products.findIndex(p => p.id === parseInt(id));
//     if (index === -1) return false;
    
//     db.products.splice(index, 1);
//     return true;
    
//     /* Uncomment this when using a real database
//     return new Promise((resolve, reject) => {
//       // MySQL example
//       const query = 'DELETE FROM products WHERE id = ?';
//       pool.query(query, [id], (err, result) => {
//         if (err) return reject(err);
//         resolve(result.affectedRows > 0);
//       });
      
//       // MongoDB example
//       // const collection = dbConnection.collection('products');
//       // collection.deleteOne({ _id: id })
//       //   .then(result => resolve(result.deletedCount > 0))
//       //   .catch(err => reject(err));
//     });
//     */
//   }
// };

// module.exports = productModel;
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const path = require('path');

// Create a GridFS stream instance
const conn = mongoose.connection;


const productSchema = new mongoose.Schema({
  id1: { type: Number,unique: true }, // Auto-increment field
  name: { type: String, required: true },
  price: { type: Number, required: true },
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

