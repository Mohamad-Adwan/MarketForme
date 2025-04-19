
# ShopEase E-Commerce Application

## Local Database Setup

### 1. Database Schema

Create the following tables in your database:

#### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255),
  category VARCHAR(100),
  featured BOOLEAN DEFAULT FALSE,
  stock INT NOT NULL DEFAULT 0
  
);
```

#### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, -- Store hashed passwords only!
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Cart Items Table
```sql
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(36) NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(36) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### 2. API Setup

You'll need to create a REST API that supports the following endpoints:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Get products by category

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/user` - Get current user

- `GET /api/cart/:userId` - Get cart
- `POST /api/cart/:userId` - Add to cart
- `PUT /api/cart/:userId/item/:productId` - Update cart item
- `DELETE /api/cart/:userId/item/:productId` - Remove from cart
- `DELETE /api/cart/:userId/clear` - Clear cart

- `GET /api/orders/:userId` - Get orders
- `POST /api/orders` - Create order

### 3. Configuration

Update the API URL in `src/config/dbConfig.ts` to point to your local API server.

### 4. Running the Application

```bash
# Install dependencies
npm install

# Start the frontend
npm run dev

# In a separate terminal, start your API server
# (command will depend on your API implementation)
```
