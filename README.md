
# 🛍️ Tech-Shop E-Commerce Application

An online shopping platform for modern e-commerce experiences built with [your stack here, e.g., Node.js + Express + React + Mongoodb].


## 📚 Table of Contents

- [Database Schema](#1-database-Schema)
- [API Endpoints](#2-api-setup)
- [Configuration](#3-configuration)
- [Running the Application](#4-running-the-application)
- [Note](#5-Note)

## 🔧 Tech Stack

- Frontend: React, TailwindCSS 
- Backend: Node.js, Express 
- Database: MongooDB
- Auth: JWT

## ✨ Features

- User authentication & registration
- User Email Verification And Number Verification Using Whatsapp 
- Product listing and categories
- Add to cart and manage cart
- Place orders and view history
- Tracking Order Status
- Printing Invoice
- Filtring Search on product
- Admin Dasdashboard

## Local Database Setup

### 1. Database Schema
## 1. 📦 Database Collections (MongoDB)

### 🛍️ `products` Collection

```js
{
  id: Number,
  name: String,
  description: String,
  price: Number,
  discountprice:Number,
  image: {
    data: Buffer,
    contentType: String,
    FileName: String,
  },
  category: String,
  featured: Boolean,
  stock: Number
}

```
### 👤 `User` Collection

```js
{
  id: Number,
  name: String,
  email: String,
  phone: Number,
  password: String, 
  role: "admin" | "user",
  emailVerified: Boolean,
  verificationCode: String,
  phoneVerified: Boolean,
  resetCode: String,
  ordersCount: Number,
  created_at: Date
}
```
### 🛒 `Cart Items` Collection
```js
userId: String,
  items: [
    {
      id: String, 
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
```
### 📦 `Orders` Collection
```js
{
  id: Number,
  userName: String,
price: Number,
total: Number,
phone: Number,
  userId: Number,
items: [
    {
      productId: Number, 
      quantity: Number, 
      price: Number,
      image: {
        data: Buffer, 
        contentType: String,
        FileName: String
      },
      itemname:  String ,
    }

  ],
  status: { type: String, default: "pending" ,enum:['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
  date: Date,
}

```
###  `Global` Collection
```js
 showPrice: {
     Boolean
     }
```

### 2. API Setup

You'll need to create a REST API that supports the following endpoints:
```
- `GET /api/product/` - Get all products
- `GET /api/product/:id` - Get a product by ID
- `GET /api/product/featured` - Get featured products
- `GET /api/product/category/:category` - Get products by category
- `GET /api/product/Dasdashboard` - Get Dasdashboard
- `DELETE /api/product/:id` - Delete products by id
```
```
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/user` - Get current user
- `GET /api/auth/users` - Get All users
- `GET /api/auth/user/userId` - Get user by ID
- `POST /api/auth/verify-email` - Verify Email
- `POST /api/auth/verify-phone` - Verify Phone
- `POST /api/auth/send-phone-verification` - Send Phone Verification
- `POST /api/auth/registerWithPhone` - Register With Phone 
- `POST /api/auth/forgot-password` - Forgot Password
- `POST /api/auth/reset-password` - Reset Password
- `PUT /api/auth/user-role` - Update User Role
- `DELETE /api/user/:userId` - Delete user by id
- `GET /api/user/Dasdashboard` - Get Dasdashboard
```
```
- `GET /api/cart/:userId` - Get cart
- `POST /api/cart/:userId` - Add to cart
- `PUT /api/cart/:userId/item/:productId` - Update cart item
- `DELETE /api/cart/:userId/item/:productId` - Remove from cart
- `DELETE /api/cart/clear/:userId` - Clear cart
```
```
- `GET /api/orders/:userId` - Get orders
- `GET /api/orders/detail/:orderId` - Get orders by ID
- `GET /api/order/Dasdashboard` - Get Dasdashboard
- `POST /api/orders` - Create order
- `PUT  /api/orders/status/:orderId` - Update order Status
- `PUT /api/orders/edit/item/:itemId` - Edit Item Quantity
- `DELETE /api/orders/:orderId` - Delete order
- `DELETE /api/orders/item/:itemId` - Delete Item from order
```
```
- `PUT /api/global/putpriceState` Change price State show or not
- `GET /api/global/getpriceState` Get State
- `GET api/global/printPDF` printPDF order

```
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
### 5. Note
```bash
#Dont Forget to add this to you .git file
PORT=
JWT_SECRET=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=
DATABASE_URL=mongodb:
production=
EMAIL_PASS=
EMAIL_USER=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER= 
TWILIO_CONTENT_SID= 

```
