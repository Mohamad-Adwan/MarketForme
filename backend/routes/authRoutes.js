
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login
router.post('/login', authController.login);

// Register
router.post('/register', authController.register);

// Verify Email
router.post('/verify-email', authController.verifyEmail);

// Verify Phone Number
router.post('/verify-phone', authController.verifyPhone);

// Verify Phone Number with OTP
router.post('/send-phone-verification', authController.sendPhoneVerificationCode);

// register  phone number
router.post('/registerWithPhone', authController.registerWithPhone);

// Forgot Password
router.post('/forgot-password', authController.forgotPassword);

// Reset Password
router.post('/reset-password', authController.resetPassword);

// Get Current User
router.get('/user', authController.getCurrentUser);

// Get All Users (admin only)
router.get('/users', authController.getAllUsers);

router.get('/user/:userId', authController.getuserbyID);
// Update User Role (admin only)
router.put('/user-role', authController.updateUserRole);

// Delete User (admin only)
router.delete('/user/:userId', authController.deleteUser);

router.get('/Dasdashboard', authController.getDashboard);

module.exports = router;
