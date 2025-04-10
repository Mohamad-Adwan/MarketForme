
// // Mock database (replace with your actual database connection)
// const db = {
//   products: [
//     {
//       id: 1,
//       name: 'Wireless Headphones',
//       description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
//       price: 199.99,
//       image: '/images/headphones.jpg',
//       category: 'electronics',
//       featured: true,
//       stock: 45
//     },
//     {
//       id: 2,
//       name: 'Smartphone',
//       description: 'Latest model smartphone with 128GB storage and triple camera system.',
//       price: 799.99,
//       image: '/images/smartphone.jpg',
//       category: 'electronics',
//       featured: true,
//       stock: 20
//     },
//     {
//       id: 3,
//       name: 'Running Shoes',
//       description: 'Lightweight running shoes with superior cushioning and support.',
//       price: 129.99,
//       image: '/images/running-shoes.jpg',
//       category: 'clothing',
//       featured: false,
//       stock: 58
//     }
//   ],
//   users: [
//     {
//       id: '1',
//       name: 'Admin User',
//       email: 'admin@example.com',
//       password: '$2b$10$abcdefghijklmnopqrstuv', // hashed 'admin123'
//       role: 'admin'
//     },
//     {
//       id: '2',
//       name: 'Regular User',
//       email: 'user@example.com',
//       password: '$2b$10$abcdefghijklmnopqrstuv', // hashed 'user123'
//       role: 'user'
//     }
//   ],
//   carts: {},
//   orders: []
// };

// module.exports = db;
const mongoose = require("mongoose");

const db = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL); // Removed deprecated options
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = db;