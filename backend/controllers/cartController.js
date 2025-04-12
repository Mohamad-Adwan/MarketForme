
// const cartModel = require('../models/cartModel');

// const cartController = {
//   getCart: (req, res) => {
//     const userId = req.params.userId;
//     const cart = cartModel.getCart(userId);
//     res.json(cart);
//   },
  
//   addToCart: (req, res) => {
//     const userId = req.params.userId;
//     const { productId, quantity } = req.body;
    
//     const updatedCart = cartModel.addToCart(userId, productId, quantity);
//     res.json(updatedCart);
//   },
  
//   updateCartItem: (req, res) => {
//     const { userId, productId } = req.params;
//     const { quantity } = req.body;
    
//     const updatedCart = cartModel.updateCartItem(userId, productId, quantity);
//     if (!updatedCart) return res.status(404).json({ message: 'Cart or item not found' });
    
//     res.json(updatedCart);
//   },
  
//   removeFromCart: (req, res) => {
//     const { userId, productId } = req.params;
    
//     const updatedCart = cartModel.removeFromCart(userId, productId);
//     if (!updatedCart) return res.status(404).json({ message: 'Cart not found' });
    
//     res.json(updatedCart);
//   },
  
//   clearCart: (req, res) => {
//     const userId = req.params.userId;
    
//     const emptyCart = cartModel.clearCart(userId);
//     res.json(emptyCart);
//   }
// };

// module.exports = cartController;
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');  // Import the Order model
const {Product} = require('../models/productModel');  // Import the Order model

const cartController = {
  // Get cart
  getCart: async (req, res) => {
    const { userId } = req.params;
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const cartsWithBase64Images = cart.items.map(item => {
        const base64Image =
          item.image && item.image.data && Buffer.isBuffer(item.image.data)
            ? `data:${item.image.contentType};base64,${item.image.data.toString('base64')}`
            : null;
  
        return {
          id1: item.id1,
          name: item.itemname,
          quantity: item.quantity,
          price: item.price,
          image: base64Image,
          
        };
      });
  
      res.json({
        userId: cart.userId,
        items: cartsWithBase64Images
      });
  
    } catch (err) {
      res.status(500).json({ message: 'Error fetching cart', error: err });
    }
  },
  

  // Add to cart
  // addToCart: async (req, res) => {
  //   const { userId } = req.params;
  //   const { id1, quantity, price,image,itemname } = req.body;
  //   console.log("itemname in addToCart:", itemname);
  //   console.log("Image in addToCart:", image);
  //   try {
  //     //const imagee = image.match(/^data:image\/([a-zA-Z]*);base64,([^\"]*)$/);
  //     let cart = await Cart.findOne({ userId:userId });

  //     if (!cart) {
  //       cart = new Cart({
  //         userId,
  //         items: [{ id1, quantity, price,image,itemname }],
  //       });

  //     } else {
  //       // Find the index of the item with the matching id1
  //       const itemIndex = cart.items.findIndex(item => item.id1 === String(id1));
        
        
  //       // Also log the items in the cart to see what's inside
        
  //       if (itemIndex !== -1) {
  //         // If the item exists, increment the quantity by 1
  //         cart.items[itemIndex].quantity += 1;
  //         //console.log("Item already exists, incrementing quantity");
  //       } else {
  //         // If the item doesn't exist, add it with a quantity of 1
  //         cart.items.push({ id1, quantity: 1, price,imagee,itemname });
  //        // console.log("Item added to cart");
  //       }
  //     }

  //     await cart.save();

  //     res.json(cart);

  //   } catch (err) {
  //     res.status(500).json({ message: 'Error adding item to cart', error: err });
  //   }
  // },
  addToCart: async (req, res) => {
    const { userId } = req.params;
    const { id1, quantity, price, itemname} = req.body;
  
   
  const product =await Product.findOne({ id1: id1 });
    try {
      let cart = await Cart.findOne({ userId: userId });
  
      // If no cart exists, create a new one
      if (!cart) {
        cart = new Cart({
          userId,
          items: [{
            id1,
            quantity,
            price,
            itemname,
            image: {
              data: product.image.data, 
              contentType: product.image.contentType,
              FileName: product.image.FileName
              
            }
          }],
        });
      } else {
        // Find if the item already exists in the cart
        const itemIndex = cart.items.findIndex(item => item.id1 === String(id1));
  
        if (itemIndex !== -1) {
          // If the item exists, update the quantity
          cart.items[itemIndex].quantity += quantity; // Increment by the quantity sent
          console.log("Item already exists, incrementing quantity");
        }  else {
          // If the item doesn't exist, add it to the cart
          cart.items.push({
            id1,
            quantity,
            price,
            itemname,
            image: {
              data: product.image.data,
              contentType: product.image.contentType,
              FileName: product.image.FileName
            }
          });
          console.log("Item added to cart");
        }
      }
  
      // Save the updated cart
      await cart.save();
  
      // Return the updated cart
      res.json(cart);
  
    } catch (err) {
      res.status(500).json({ message: 'Error adding item to cart', error: err });
    }
  },
  
  // Update cart item
  updateCartItem: async (req, res) => {
    const { userId, id1 } = req.params;
    const { quantity } = req.body;

    try {
      const cart = await Cart.findOne({ userId });

      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      const itemIndex = cart.items.findIndex(item => item.id1 === String(id1));
      if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });

      cart.items[itemIndex].quantity = quantity; // Update the item quantity
      await cart.save();
      
      res.json(cart);
    } catch (err) {
      res.status(500).json({ message: 'Error updating cart item', error: err });
    }
  },

  // Remove from cart
  removeFromCart: async (req, res) => {
    const { userId, id1 } = req.params;
  
    try {
      const cart = await Cart.findOne({ userId });
  
      if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
      const itemIndex = cart.items.findIndex(item => item.id1 === String(id1));
      if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });
  
      // Remove the item
      cart.items.splice(itemIndex, 1);
  
      if (cart.items.length === 0) {
        // If the cart is now empty, delete the entire cart
        await Cart.deleteOne({ userId });
        return res.json({ message: 'Item removed and cart cleared because it was the last item' });
      }
  
      await cart.save();
      res.json({ message: 'Item removed', cart });
  
    } catch (err) {
      res.status(500).json({ message: 'Error removing item from cart', error: err });
    }
  },  

  // Clear cart
  clearCart: async (req, res) => {
    const { userId } = req.params;

    try {
      const cart = await Cart.findOneAndDelete({ userId:userId });

      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      res.json({ message: 'Cart cleared' });
    } catch (err) {
      res.status(500).json({ message: 'Error clearing cart', error: err });
    }
  },

  // Checkout - Create order from cart
  checkout: async (req, res) => {
    const { userId } = req.params;

    try {
      const cart = await Cart.findOne({ userId });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      // Calculate total price
      const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Create a new order using the cart data
      const order = new Order({
        userId,
        total,
        items: cart.items,
        status: 'pending', // or any other status
      });

      // Save the order
      await order.save();

      // Clear the cart after the order is placed
      await Cart.findOneAndDelete({ userId });

      // Return the created order
      res.json({ message: 'Order created successfully', order });
    } catch (err) {
      res.status(500).json({ message: 'Error processing checkout', error: err });
    }
  },
};

module.exports = cartController;
