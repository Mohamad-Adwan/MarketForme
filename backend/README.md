
# ShopEase Backend

This is the backend API server for the ShopEase E-Commerce Application, built using the MVC (Model-View-Controller) architecture pattern.

## Project Structure

```
backend/
├── controllers/        # Handle the application logic
├── models/             # Handle data and business logic
├── routes/             # Define API routes
├── .env                # Environment variables
├── package.json        # Project dependencies
├── server.js           # Entry point
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

The server implements the following endpoints:

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Get products by category

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/user` - Get current user

### Cart
- `GET /api/cart/:userId` - Get cart
- `POST /api/cart/:userId` - Add to cart
- `PUT /api/cart/:userId/item/:productId` - Update cart item
- `DELETE /api/cart/:userId/item/:productId` - Remove from cart
- `DELETE /api/cart/:userId/clear` - Clear cart

### Orders
- `GET /api/orders/:userId` - Get orders
- `POST /api/orders` - Create order

## Database Integration

This example uses an in-memory database for demonstration purposes. In a production environment, you would connect to a real database system like MySQL, PostgreSQL, or MongoDB.

To connect to a real database, modify the models to use your preferred database driver and replace the mock db object with actual database queries.
