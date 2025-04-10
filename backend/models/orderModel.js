
// const db = require('./dbConnection');

// const orderModel = {
//   getUserOrders: (userId) => {
//     return db.orders.filter(order => order.userId === userId);
//   },
  
//   // Database implementation (uncomment when ready)
//   /*
//   getUserOrdersFromDb: async (userId) => {
//     // Example using MySQL
//     // const [rows] = await db.promise().query('SELECT * FROM orders WHERE userId = ?', [userId]);
//     // return rows;
    
//     // Example using MongoDB
//     // return await db.collection('orders').find({ userId }).toArray();
//   },
//   */
  
//   createOrder: (orderData) => {
//     const newOrder = {
//       id: db.orders.length + 1,
//       date: new Date().toISOString(),
//       status: 'pending',
//       ...orderData
//     };
    
//     db.orders.push(newOrder);
    
//     // Clear the user's cart after order is created
//     if (db.carts[orderData.userId]) {
//       db.carts[orderData.userId] = { items: [] };
//     }
    
//     return newOrder;
//   },
  
//   // Database implementation (uncomment when ready)
//   /*
//   createOrderInDb: async (orderData) => {
//     // Example using MySQL
//     // const newOrder = {
//     //   date: new Date().toISOString(),
//     //   status: 'pending',
//     //   ...orderData
//     // };
//     // const [result] = await db.promise().query('INSERT INTO orders SET ?', [newOrder]);
//     // newOrder.id = result.insertId;
//     //
//     // // Also clear the user's cart in the database
//     // await db.promise().query('DELETE FROM cart_items WHERE userId = ?', [orderData.userId]);
//     // 
//     // return newOrder;
    
//     // Example using MongoDB
//     // const newOrder = {
//     //   date: new Date().toISOString(),
//     //   status: 'pending',
//     //   ...orderData
//     // };
//     // const result = await db.collection('orders').insertOne(newOrder);
//     // newOrder.id = result.insertedId;
//     //
//     // // Also clear the user's cart in the database
//     // await db.collection('cartItems').deleteMany({ userId: orderData.userId });
//     //
//     // return newOrder;
//   },
//   */
  
//   getOrderById: (orderId) => {
//     return db.orders.find(order => order.id === orderId);
//   },
  
//   // Database implementation (uncomment when ready)
//   /*
//   getOrderByIdFromDb: async (orderId) => {
//     // Example using MySQL
//     // const [rows] = await db.promise().query('SELECT * FROM orders WHERE id = ?', [orderId]);
//     // return rows[0] || null;
    
//     // Example using MongoDB
//     // return await db.collection('orders').findOne({ _id: orderId });
//   },
//   */

//   updateOrderStatus: (orderId, status) => {
//     const orderIndex = db.orders.findIndex(order => order.id === orderId);
    
//     if (orderIndex === -1) return null;
    
//     db.orders[orderIndex] = {
//       ...db.orders[orderIndex],
//       status
//     };
    
//     return db.orders[orderIndex];
//   },
  
//   // Database implementation (uncomment when ready)
//   /*
//   updateOrderStatusInDb: async (orderId, status) => {
//     // Example using MySQL
//     // await db.promise().query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
//     // const [rows] = await db.promise().query('SELECT * FROM orders WHERE id = ?', [orderId]);
//     // return rows[0] || null;
    
//     // Example using MongoDB
//     // const result = await db.collection('orders').findOneAndUpdate(
//     //   { _id: orderId },
//     //   { $set: { status } },
//     //   { returnDocument: 'after' }
//     // );
//     // return result.value;
//   },
//   */

//   getAllOrders: () => {
//     return db.orders;
//   },
  
//   // Database implementation (uncomment when ready)
//   /*
//   getAllOrdersFromDb: async () => {
//     // Example using MySQL
//     // const [rows] = await db.promise().query('SELECT * FROM orders');
//     // return rows;
    
//     // Example using MongoDB
//     // return await db.collection('orders').find({}).toArray();
//   },
//   */
  
//   deleteOrder: (orderId) => {
//     const orderIndex = db.orders.findIndex(order => order.id === orderId);
    
//     if (orderIndex === -1) return false;
    
//     db.orders.splice(orderIndex, 1);
//     return true;
//   },
  
//   // Database implementation (uncomment when ready)
//   /*
//   deleteOrderFromDb: async (orderId) => {
//     // Example using MySQL
//     // const [result] = await db.promise().query('DELETE FROM orders WHERE id = ?', [orderId]);
//     // return result.affectedRows > 0;
    
//     // Example using MongoDB
//     // const result = await db.collection('orders').deleteOne({ _id: orderId });
//     // return result.deletedCount > 0;
//   }
//   */
// };

// module.exports = orderModel;
const mongoose = require('mongoose');
const { number } = require('zod');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema({
  id2:{type: Number},
  userName: {type:String},
  userId: { type: Number, required: true },
  total: { type: Number, required: true },
  phone: { type: String, required: true },
  items: [
    {
      id1: { type: Number, required: true },  // productId
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      itemname: { type: String, required: true },
    }
  ],
  status: { type: String, default: "pending" ,enum:['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
  date: { type: Date, default: Date.now }
});
orderSchema.plugin(AutoIncrement, { inc_field: 'id2' , counter_name: 'order_counter' });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;