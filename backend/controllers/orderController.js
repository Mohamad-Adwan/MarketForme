const User = require('../models/userModel'); // Corrected import for User model
const Order = require('../models/orderModel');
const {Product} = require('../models/productModel'); // Assuming you have a Product model for fetching product details
const orderController = {
  // Get all orders for a specific user
  getOrders: async (req, res) => {
    const  userId  = req.params.userId; // id here is the userId
  
    try {
      const orders = await Order.find({ userId:userId});
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
  
      const formattedOrders = orders.map(order => {
        const itemsWithBase64Images = order.items.map(item => {
          const base64Image =
            item.image && item.image.data && Buffer.isBuffer(item.image.data)
              ? `data:${item.image.contentType};base64,${item.image.data.toString('base64')}`
              : null;
  
          return {
            id1: item.id1,
            itemname: item.itemname,
            quantity: item.quantity,
            price: item.price,
            image: base64Image,
          };
        });
  
        return {
          orderId: order._id,
          userId: order.userId,
          userName: order.userName,
          total: order.total,
          phone: order.phone,
          status: order.status,
          date: order.date,
          items: itemsWithBase64Images
        };
      });
  
      res.json(formattedOrders);
  
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ message: 'Error fetching orders', error });
    }
  }
,  
  getDashboard: async (req, res) => {
    try {
      // Fetch only orders with status 'delivered'
      const orders = await Order.find({ status: 'delivered' });
      const allorder = await Order.find();

      //console.log('orders:', allorder);
  
      const totalOrders = allorder.length;
      const totalSales = orders.reduce((sum, order) => {
        if (order.status === 'delivered') { // Check if the order status is 'delivered'
          return sum + order.total; // Add order total to the sum if it's delivered
        }
        return sum; // Otherwise, don't add the order total
      }, 0);
      const pendingOrders = allorder.filter(order => order.status === 'pending').length;
      const canceledOrders = allorder.filter(order => order.status === 'cancelled').length;
      const deliveredOrders = allorder.filter(order => order.status === 'delivered').length;
      const shippedOrders = allorder.filter(order => order.status === 'shipped').length;
      const processingOrders = allorder.filter(order => order.status === 'processing').length;
      console.log('pendingOrders:', pendingOrders);
      console.log('canceledOrders:', canceledOrders);
      console.log('deliveredOrders:', deliveredOrders);
      console.log('shippedOrders:', shippedOrders);
      console.log('processingOrders:', processingOrders);
      // Calculate recentSales grouped by date for delivered orders
      const recentSales = orders.reduce((acc, order) => {
        if (order.status === 'delivered') { // Ensure we only count delivered orders
          const date = new Date(order.date).toISOString().split('T')[0]; // Format as YYYY-MM-DD
          if (!acc[date]) {
            acc[date] = { date, amount: 0 };
          }
          acc[date].amount += order.total; // Add order total to the date's sales
        }
        return acc;
      }, {});
  
      // Convert object to array and sort by date
      const recentSalesArray = Object.values(recentSales).sort((a, b) => new Date(b.date) - new Date(a.date));
      const sortedOrders = orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      const top5RecentOrders = sortedOrders.slice(0, 5);
      // Get top 5 products by sales from delivered orders
      const productSales = {};
  
      // Aggregate product sales from delivered orders only
      orders.forEach(order => {
        if (order.status === 'delivered') { // Check if the order status is 'delivered'
          order.items.forEach(item => {
            if (!productSales[item.id1]) {
              productSales[item.id1] = 0;
            }
            productSales[item.id1] += item.price * item.quantity; // Calculate total sales for the product
          });
        }
      });
  
      // Convert the product sales data to an array, sort by sales, and get the top 5
      const topProducts = Object.entries(productSales)
  .map(([id1, sales]) => ({ id1, sales }))
  .sort((a, b) => b.sales - a.sales) // Sort by sales in descending order
  .slice(0, 5); // Take the top 5 products

// Now, retrieve the full details for these top products
const topProductIds = topProducts.map((product) => product.id1); // Extract the product names (or ids) from the top products

// Assuming you have a Product model to query your database
const fullProductDetails = await Product.find({ id1: { $in: topProductIds } });

// You can then send the details in your response
// res.json({ topProducts: fullProductDetails });

  
      // Respond with the aggregated data
      res.json({
        totalOrders,
        totalSales,
        pendingOrders,
        canceledOrders,
        deliveredOrders,
        shippedOrders,
        processingOrders,
        recentSales: recentSalesArray, // Recent sales grouped by date for delivered orders
        topProducts:fullProductDetails, // Top 5 products by sales for delivered orders
        top5RecentOrders,
      });
    } catch (error) {
      console.error('Error fetching dashboard info:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard info' });
    }
  },
    
  // Create a new order
  createOrder: async (req, res) => {
    try {
      const orderData = req.body;

      if (!orderData.userId || !orderData.total) {
        return res.status(400).json({ error: 'Invalid order data' });
      }

      // Correct the way you're finding the user
      const user = await User.findOne({id:orderData.userId}); // find user by ID using the correct method
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPhoneVerified = user.phoneVerified; // Ensure this property exists in your User model
      if (!isPhoneVerified) {
        return res.status(403).json({ 
          error: 'Phone verification required',
          message: 'Please verify your phone number before creating orders'
        });
      }
      
      ////here edite
      for (const item of orderData.items) {
        const product = await Product.findOne({ id1: item.id1 });
      
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for product: ${item.itemname}` });
        }
      
        item.image = {
          data: product.image.data,
          contentType: product.image.contentType,
          FileName: product.image.FileName
        };
      }
     console.log('User found:', orderData);
      const newOrder = new Order({
        userId: orderData.userId, // Corrected field name to match your schema
        total: orderData.total,
        userName: orderData.userName,
        phone:user.phone,
        status: 'pending',
        items: orderData.items.map(item => ({
          id1: item.id1, // Corrected field name to match your schema
          quantity: item.quantity,
          price: item.price,
          image:{data:item.image.data,
            contentType:item.image.contentType,
            FileName:item.image.FileName
          },
          itemname:item.itemname

        }))
      });

      await newOrder.save();
      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  },
  createOrderGuest: async (req, res) => {
    try {
      const orderData = req.body;

      if (!orderData.userId || !orderData.total, !orderData.phone) {
        return res.status(400).json({ error: 'Invalid order data' });
      }

      
      
      ////here edite
      for (const item of orderData.items) {
        const product = await Product.findOne({ id1: item.id1 });
      
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for product: ${item.itemname}` });
        }
      
        item.image = {
          data: product.image.data,
          contentType: product.image.contentType,
          FileName: product.image.FileName
        };
      }
     console.log('User found:', orderData);
      const newOrder = new Order({
        userId: orderData.userId, // Corrected field name to match your schema
        total: orderData.total,
        userName: orderData.userName,
        phone:orderData.phone,
        status: 'pending',
        items: orderData.items.map(item => ({
          id1: item.id1, // Corrected field name to match your schema
          quantity: item.quantity,
          price: item.price,
          image:{data:item.image.data,
            contentType:item.image.contentType,
            FileName:item.image.FileName
          },
          itemname:item.itemname

        }))
      });

      await newOrder.save();
      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  },

  // Get order by ID
  getOrderById: async (req, res) => {
    try {
      const orderId = req.params.orderId; // assuming orderId is a string, no need for parsing into int
      const order = await Order.findOne({ id2: orderId }); // Correct field name for order ID
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Map through the items and convert image data to Base64
      const updatedItems = order.items.map(item => {
        // Convert image data to Base64 if available
        const base64Image =
          item.image && item.image.data && Buffer.isBuffer(item.image.data)
            ? `data:${item.image.contentType};base64,${item.image.data.toString('base64')}`
            : null;
        
        // Return item with Base64 image
        return {
          ...item,  // Spread original item data
          image: base64Image  // Add Base64 encoded image (or null if no image)
        };
      });
  
      // Return the order with the updated items
      const orderWithBase64Images = {
        ...order.toObject(),  // Convert order to plain object
        items: updatedItems     // Replace items with the updated ones
      };
  
      // Respond with order having Base64 encoded images
      res.json(orderWithBase64Images);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ error: 'Failed to fetch order details' });
    }
  },
  
  edititemQuantity: async (req, res) => {
    try {
      itemId = req.params.itemId; // Assuming you're passing the item ID as a parameter
      const { orderId, quantity } = req.body; // Pass orderId, itemId, and quantity in the body
      console.log('itemId:', itemId);
      console.log('orderId:', orderId);
      console.log('quantity:', quantity);
  
      // Fetch order data
      const orderData = await Order.findOne({ id2: orderId });
  
      // Check if the order exists
      if (!orderData) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Check if the order status is 'delivered'
      if (orderData.status === 'delivered') {
        return res.status(400).json({ error: 'Cannot update item quantity for delivered order' });
      }
  
      // Fetch the product to check stock availability
      const product = await Product.findOne({ id1: itemId });
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Check if there's enough stock for the requested quantity
      if (product.stock < quantity) {
         res.status(400).json({ error: `Insufficient stock for product: ${product.itemname}` });
         return;
      }
  
      // Update the item's quantity in the order
      let itemUpdated = false;
      for (const item of orderData.items) {
        console.log('itemId:', item.id1);
        if (item.id1 === Number(itemId)) {
          item.quantity = quantity; // Update the quantity of the item
          orderData.total = orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0); // Recalculate total
          product.stock -= quantity; // Deduct the quantity from the product stock
          itemUpdated = true;
          break;
        }
      }
  
      if (!itemUpdated) {
        return res.status(404).json({ error: 'Item not found in order' });
      }
  
      // Save the updated order
      await orderData.save();
      res.status(200).json({ message: 'Item quantity updated successfully', order: orderData });
    } catch (error) {
      console.error('Error updating item quantity:', error);
      res.status(500).json({ error: 'Failed to update item quantity' });
    }
  },
  
  // Update order status
  updateOrderStatus: async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      //////here edit
      if (status === 'delivered') {
        const order = await Order.findOne({ id2: orderId });
        const user = await User.findOne({ id: order.userId });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        user.ordersCount += 1; // Increment the user's orders count
        await user.save();
        for (const item of order.items) {
          const product = await Product.findOne({ id1: item.id1 });
          if (product) {
            product.stock -= item.quantity;
            await product.save();
          }
        }
      }

    
      const updatedOrder = await Order.findOneAndUpdate(
        { id2: orderId },  // Correct field for finding the order
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  },
  deleteitem : async (req, res) => {
    try {
      const itemId = req.params.itemId; // Assuming you're passing the order item ID as a parameter
      const {orderId} = req.body; // Assuming you're passing the order ID as a parameter
  
      // Find the order by ID
     // const order = await Order.findOne({ id2: orderId });
  
      // if (!order) {
      //   return res.status(404).json({ error: 'Order not found' });
      // }
  console.log('order:', itemId,orderId);
      // Find the index of the item to delete
      //const itemIndex = order.items.findIndex(item => item.id1 === itemId);
      const updatedOrder = await Order.findOneAndUpdate(
        { id2: orderId },
        { $pull: { items: { id1: itemId } } },
        { new: true } // Return the updated document

      );
      // if (itemIndex === -1) {
      //   return res.status(404).json({ error: 'Order item not found' });
      // }
  
      // Remove the item from the order
      // order.items.splice(itemIndex, 1);
    
  
      res.json({ message: 'Order item deleted successfully', updatedOrder });
    } catch (error) {
      console.error('Error deleting order item:', error);
      res.status(500).json({ error: 'Failed to delete order item' });
    }
  }
  , 
  // Get all orders
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find();
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found' });
      }
  
      const ordersWithBase64Images = orders.map(order => {
        const updatedItems = order.items.map(item => {
          const base64Image =
            item.image && item.image.data && Buffer.isBuffer(item.image.data)
              ? `data:${item.image.contentType};base64,${item.image.data.toString('base64')}`
              : null;
  
          return {
            id1: item.id1,
            itemname: item.itemname,
            quantity: item.quantity,
            price: item.price,
            image: base64Image
          };
        });
  
        return {
          id2: order.id2,
          userId: order.userId,
          userName: order.userName,
          total: order.total,
          status: order.status,
          date: order.date,
          phone:order.phone,
          items: updatedItems
        };
      });
      res.json(ordersWithBase64Images);
  
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders', error });
    }
  },  
  
  // Delete order by ID
  deleteOrder: async (req, res) => {
    try {
      const orderId = req.params.orderId;

      const result = await Order.deleteOne({ id2: orderId });  // Correct field for deleting order

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ error: 'Failed to delete order' });
    }
  }
};
//delete item from order





module.exports = orderController;
