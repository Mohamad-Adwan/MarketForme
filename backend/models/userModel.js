
// const db = require('./db');
// const bcrypt = require('bcrypt');
// const { v4: uuidv4 } = require('uuid');

// const userModel = {
//   getUserByEmail: (email) => {
//     return db.users.find(u => u.email === email);
//   },
  
//   getUserById: (id) => {
//     return db.users.find(u => u.id === id);
//   },
  
//   createUser: async (userData) => {
//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(userData.password, salt);
    
//     const newUser = {
//       id: uuidv4(),
//       name: userData.name,
//       email: userData.email,
//       password: hashedPassword,
//       role: 'user',
//       emailVerified: userData.emailVerified || true, // Default to true for now
//       verificationCode: userData.verificationCode || null,
//       resetCode: null,
//       joinDate: new Date().toISOString()
//     };
    
//     db.users.push(newUser);
//     return newUser;
//   },
  
//   verifyPassword: async (password, hashedPassword) => {
//     return await bcrypt.compare(password, hashedPassword);
//   },

//   verifyUserEmail: (email) => {
//     const userIndex = db.users.findIndex(u => u.email === email);
    
//     if (userIndex === -1) return null;
    
//     db.users[userIndex].emailVerified = true;
//     db.users[userIndex].verificationCode = null;
    
//     return db.users[userIndex];
//   },
  
//   setPasswordResetCode: (email, resetCode) => {
//     const userIndex = db.users.findIndex(u => u.email === email);
    
//     if (userIndex === -1) return null;
    
//     db.users[userIndex].resetCode = resetCode;
    
//     return db.users[userIndex];
//   },
  
//   resetUserPassword: async (email, newPassword) => {
//     const userIndex = db.users.findIndex(u => u.email === email);
    
//     if (userIndex === -1) return null;
    
//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(newPassword, salt);
    
//     db.users[userIndex].password = hashedPassword;
//     db.users[userIndex].resetCode = null;
    
//     return db.users[userIndex];
//   },
  
//   getAllUsers: () => {
//     return db.users;
//   },
  
//   updateUserRole: (userId, role) => {
//     const userIndex = db.users.findIndex(u => u.id === userId);
    
//     if (userIndex === -1) return null;
    
//     db.users[userIndex].role = role;
    
//     return db.users[userIndex];
//   },
  
//   deleteUser: (userId) => {
//     const userIndex = db.users.findIndex(u => u.id === userId);
    
//     if (userIndex === -1) return false;
    
//     // Remove the user
//     db.users.splice(userIndex, 1);
    
//     // Remove related orders
//     db.orders = db.orders.filter(order => order.userId !== userId);
    
//     // Remove user's cart
//     if (db.carts[userId]) {
//       delete db.carts[userId];
//     }
    
//     return true;
//   }
// };

// module.exports = userModel;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//const { v4: uuidv4 } = require('uuid');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the schema for the user
const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
  },
  phone: {
    type: String,
       
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  emailVerified: {
    type: Boolean,
    default: false, // Defaults to false until verified
  },
  verificationCode: {
    type: String,
    default: null,
  },
  phoneVerified: {
    type: Boolean,
    default: false, // Defaults to false until verified
  },
  resetCode: {
    type: String,
    default: null,
  },
  
  ordersCount:{
     type:Number,
    default:null
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
});
userSchema.plugin(AutoIncrement, { inc_field: 'id' , counter_name: 'user_counter' });
// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Helper method to compare password during login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Create the model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
