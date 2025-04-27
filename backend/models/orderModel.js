
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
      image: {
        data: Buffer, // use Buffer if you're storing raw binary data
        contentType: String,
        FileName: String
      },
      itemname: { type: String, required: true },
    }
  ],
  status: { type: String, default: "pending" ,enum:['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
  date: { type: Date, default: Date.now }
});
orderSchema.plugin(AutoIncrement, { inc_field: 'id2' , counter_name: 'order_counter' });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;