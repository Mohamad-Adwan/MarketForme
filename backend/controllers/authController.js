
// const userModel = require('../models/userModel');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user.id, email: user.email, role: user.role },
//     process.env.JWT_SECRET || 'your-secret-key',
//     { expiresIn: '7d' }
//   );
// };

// const authController = {
//   login: async (req, res) => {
//     try {
//       const { email, password } = req.body;
      
//       if (!email || !password) {
//         return res.status(400).json({ error: 'Email and password are required' });
//       }
      
//       const user = userModel.getUserByEmail(email);
      
//       if (!user) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }
      
//       const isPasswordValid = await userModel.verifyPassword(password, user.password);
      
//       if (!isPasswordValid) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }
      
//       // Generate JWT token
//       const token = generateToken(user);
      
//       // Return user info and token
//       res.json({
//         token,
//         user: {
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           role: user.role
//         }
//       });
//     } catch (error) {
//       console.error('Login error:', error);
//       res.status(500).json({ error: 'Login failed' });
//     }
//   },
  
//   register: async (req, res) => {
//     try {
//       const { name, email, password } = req.body;
      
//       if (!name || !email || !password) {
//         return res.status(400).json({ 
//           error: 'Name, email, and password are required' 
//         });
//       }
      
//       // Check if user already exists
//       const existingUser = userModel.getUserByEmail(email);
      
//       if (existingUser) {
//         return res.status(409).json({ error: 'User already exists' });
//       }
      
//       // Create verification code
//       const verificationCode = crypto.randomBytes(3).toString('hex');
      
//       // Create new user
//       const newUser = await userModel.createUser({
//         name,
//         email,
//         password,
//         verificationCode,
//         emailVerified: true // For simplicity, we're skipping email verification
//       });
      
//       // Generate JWT token
//       const token = generateToken(newUser);
      
//       // Return user info and token
//       res.status(201).json({
//         token,
//         user: {
//           id: newUser.id,
//           name: newUser.name,
//           email: newUser.email,
//           role: newUser.role
//         }
//       });
//     } catch (error) {
//       console.error('Registration error:', error);
//       res.status(500).json({ error: 'Registration failed' });
//     }
//   },
  
//   verifyEmail: (req, res) => {
//     try {
//       const { email, code } = req.body;
      
//       if (!email || !code) {
//         return res.status(400).json({ error: 'Email and verification code are required' });
//       }
      
//       const user = userModel.getUserByEmail(email);
      
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
      
//       if (user.verificationCode !== code) {
//         return res.status(400).json({ error: 'Invalid verification code' });
//       }
      
//       const verifiedUser = userModel.verifyUserEmail(email);
      
//       res.json({ 
//         message: 'Email verified successfully',
//         user: {
//           id: verifiedUser.id,
//           name: verifiedUser.name,
//           email: verifiedUser.email,
//           role: verifiedUser.role
//         }
//       });
//     } catch (error) {
//       console.error('Email verification error:', error);
//       res.status(500).json({ error: 'Email verification failed' });
//     }
//   },
  
//   forgotPassword: (req, res) => {
//     try {
//       const { email } = req.body;
      
//       if (!email) {
//         return res.status(400).json({ error: 'Email is required' });
//       }
      
//       const user = userModel.getUserByEmail(email);
      
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
      
//       // Generate reset code
//       const resetCode = crypto.randomBytes(3).toString('hex');
      
//       userModel.setPasswordResetCode(email, resetCode);
      
//       // In a real app, send the reset code via email
//       console.log(`Reset code for ${email}: ${resetCode}`);
      
//       res.json({ message: 'Password reset code sent' });
//     } catch (error) {
//       console.error('Forgot password error:', error);
//       res.status(500).json({ error: 'Failed to process request' });
//     }
//   },
  
//   resetPassword: async (req, res) => {
//     try {
//       const { email, code, newPassword } = req.body;
      
//       if (!email || !code || !newPassword) {
//         return res.status(400).json({ 
//           error: 'Email, reset code, and new password are required' 
//         });
//       }
      
//       const user = userModel.getUserByEmail(email);
      
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
      
//       if (user.resetCode !== code) {
//         return res.status(400).json({ error: 'Invalid reset code' });
//       }
      
//       await userModel.resetUserPassword(email, newPassword);
      
//       res.json({ message: 'Password reset successful' });
//     } catch (error) {
//       console.error('Reset password error:', error);
//       res.status(500).json({ error: 'Failed to reset password' });
//     }
//   },
  
//   getCurrentUser: (req, res) => {
//     try {
//       const authHeader = req.headers.authorization;
      
//       if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ error: 'Authorization token is required' });
//       }
      
//       const token = authHeader.split(' ')[1];
      
//       if (!token) {
//         return res.status(401).json({ error: 'Invalid authorization format' });
//       }
      
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//         const user = userModel.getUserById(decoded.id);
        
//         if (!user) {
//           return res.status(404).json({ error: 'User not found' });
//         }
        
//         res.json({
//           id: user.id,
//           name: user.name,
//           email: user.email,
//           role: user.role
//         });
//       } catch (err) {
//         return res.status(401).json({ error: 'Invalid or expired token' });
//       }
//     } catch (error) {
//       console.error('Get current user error:', error);
//       res.status(500).json({ error: 'Failed to get user information' });
//     }
//   },
  
//   getAllUsers: (req, res) => {
//     try {
//       const users = userModel.getAllUsers().map(user => ({
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         joinDate: user.joinDate
//       }));
      
//       res.json(users);
//     } catch (error) {
//       console.error('Get all users error:', error);
//       res.status(500).json({ error: 'Failed to fetch users' });
//     }
//   },
  
//   updateUserRole: (req, res) => {
//     try {
//       const { userId, role } = req.body;
      
//       if (!userId || !role) {
//         return res.status(400).json({ error: 'User ID and role are required' });
//       }
      
//       const updatedUser = userModel.updateUserRole(userId, role);
      
//       if (!updatedUser) {
//         return res.status(404).json({ error: 'User not found' });
//       }
      
//       res.json({
//         id: updatedUser.id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         role: updatedUser.role
//       });
//     } catch (error) {
//       console.error('Update user role error:', error);
//       res.status(500).json({ error: 'Failed to update user role' });
//     }
//   },
  
//   deleteUser: (req, res) => {
//     try {
//       const userId = req.params.userId;
      
//       if (!userId) {
//         return res.status(400).json({ error: 'User ID is required' });
//       }
      
//       const success = userModel.deleteUser(userId);
      
//       if (!success) {
//         return res.status(404).json({ error: 'User not found' });
//       }
      
//       res.json({ message: 'User deleted successfully' });
//     } catch (error) {
//       console.error('Delete user error:', error);
//       res.status(500).json({ error: 'Failed to delete user' });
//     }
//   }
// };

// module.exports = authController;
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../mailer'); // Import the mailer utility
const { NumberVerification } = require("../twilio");
// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

const authController = {
  // Login method
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isPasswordValid = await user.comparePassword(password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      User.findOneAndUpdate({ email }, { $set: { joinDate: new Date() } }, { new: true });
      const token = generateToken(user);
      
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  },
  
  // Register method
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }
      
      const existingUser = await User.findOne({ email });
      
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }
      //const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000); // Random 6-digit code

      const verificationCode = crypto.randomBytes(3).toString('hex');
      const subject = 'Verify Your Email Address';
      const text = `Your verification code is: ${verificationCode}`;
      const html = `<p>Your verification code is: <strong>${verificationCode}</strong></p>`;
      await sendEmail(email, subject, text, html);
      const newUser = new User({
        name,
        email,
        password,
        verificationCode,
        emailVerified: false,
      });
      
      await newUser.save();
      
      const token = generateToken(newUser);
      
      res.status(201).json({
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  },
  
  
  
  // Forgot password method
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const resetCode = crypto.randomBytes(3).toString('hex');
      const subject = 'Reset Your Email Password';
      const text = `Your reset Code  is: ${resetCode}`;
      const html = `<p>Your verification code is: <strong>${resetCode}</strong></p>`;
      await sendEmail(email, subject, text, html);
      user.resetCode = resetCode;
      await user.save();
      
      // In a real app, send the reset code via email
      console.log(`Reset code for ${email}: ${resetCode}`);
      
      res.json({ message: 'Password reset code sent' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  },
  
  // Reset password method
  resetPassword: async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      
      if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'Email, reset code, and new password are required' });
      }
      
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (user.resetCode !== code) {
        return res.status(400).json({ error: 'Invalid reset code' });
      }
      
      user.password = newPassword;
      user.resetCode = null;
      await user.save();
      
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  },
  
  // Get current user method
  getCurrentUser: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization token is required' });
      }
      
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Invalid authorization format' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findOne({ id: decoded.id });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt,
        ordersCount: user.ordersCount,
        verificationCode:user.verificationCode,
        resetCode:user.resetCode
      });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  },
  
  // // Update user role method
  // updateUserRole: async (req, res) => {
  //   try {
  //     const { userId, role } = req.body;
      
  //     if (!userId || !role) {
  //       return res.status(400).json({ error: 'User ID and role are required' });
  //     }
      
  //     const user = await User.findById(userId);
      
  //     if (!user) {
  //       return res.status(404).json({ error: 'User not found' });
  //     }
      
  //     user.role = role;
  //     await user.save();
      
  //     res.json({
  //       id: user._id,
  //       name: user.name,
  //       email: user.email,
  //       role: user.role
  //     });
  //   } catch (error) {
  //     console.error('Update user role error:', error);
  //     res.status(500).json({ error: 'Failed to update user role' });
  //   }
  // },
  
  // // Delete user method
  // deleteUser: async (req, res) => {
  //   try {
  //     const userId = req.params.userId;
      
  //     if (!userId) {
  //       return res.status(400).json({ error: 'User ID is required' });
  //     }
      
  //     const user = await User.findByIdAndDelete(userId);
      
  //     if (!user) {
  //       return res.status(404).json({ error: 'User not found' });
  //     }
      
  //     res.json({ message: 'User deleted successfully' });
  //   } catch (error) {
  //     console.error('Delete user error:', error);
  //     res.status(500).json({ error: 'Failed to delete user' });
  //   }
  // },

 getAllUsers : async (req, res) => {
    try {
      // Find all users in the database (admins can access this)
      const users = await User.find(); // Adjust query if needed (e.g., filter by role)
      res.status(200).json({ users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },
  getuserbyID : async (req, res) => {
    try {
      userId = req.params.userId;
      // Find all users in the database (admins can access this)
      const users = await User.findone(userId); // Adjust query if needed (e.g., filter by role)
      res.status(200).json({ users });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching users' });
    }
  },
  getDashboard: async (req, res) => {
      try {
        const users = await User.find();
    
        const totalUsers = users.length;
        console.log('Users:', users);
        res.json({
          totalUsers,
                  
        });
      } catch (error) {
        console.error('Error fetching dashboard info:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard info' });
      }
    },  
   updateUserRole : async (req, res) => {
    try {
      // Extract the token from Authorization header
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Extract userId and newRole from request body
      const { userId, role } = req.body;
  
      // Check if the logged-in user is an admin
      const admin = await User.findOne({ id: decoded.id });
      if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized to perform this action' });
      }
  
      // Update the user's role in the database
      const updatedUser = await User.findOneAndUpdate(
        { id: userId }, // Query by userId
        { role: role }, // Update the role
        { new: true, runValidators: true } // Ensure validation and return updated document
      );
      console.log(updatedUser);

      // If the user is not found
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Respond with success message
      res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating user role' });
    }
  }
  
,
// Email verification method
verifyEmail: async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    
    user.emailVerified = true;
    user.verificationCode = null;
    await user.save();
    
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
},  
registerWithPhone : async (req, res) => {
  const { email, phoneNumber } = req.body;
  try {
    // Step 1: Validate the phone number format (optional)
    if (!phoneNumber || phoneNumber.length < 12) {
      toast.error('Please provide a valid phone number');
      return;
    }
    const user = await User.findOne({ email });
      user.phone = phoneNumber;
      await user.save();
    // Step 2: Call the API to send a verification code to the phone number
    //const response = await authApi.sendPhoneVerificationCode(phoneNumber,user.id);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Step 3: Send the verification code to the phone number
    NumberVerification({ phoneNumber: phoneNumber, code: verificationCode }); 
      user.phoneVerified = false;
      user.verificationCode = verificationCode;
      await user.save();
    // if (response.status === 200) {
    //   // Success: Show success message or proceed to next step
    //   console.success('Verification code sent to your phone');

    // } else {
    //   // Failure: Handle any failure responses from the API
    //   console.error('Failed to send verification code. Please try again');
    // }
  } catch (error) {
    // Catch errors from API or other issues
    console.error('Error during phone verification:', error);
  }
},
// Send phone verification code method
sendPhoneVerificationCode : async (req, res) => {
  const { phone,user_id } = req.body;
  try {
    // Step 1: Validate the phone number format (optional)
    if (!phone || phone.length < 12) {
      return res.status(400).json({ error: 'Please provide a valid phone number' });
    }
    // Step 2: Generate a random verification code
    const verificationCode = crypto.randomBytes(3).toString('hex');
    // Step 3: Send the verification code to the phone number
    NumberVerification({ phoneNumber: phone, code: verificationCode }); 
    const user = await User.findOne({ id:user_id });
      user.phoneVerified = false;
      user.verificationCode = verificationCode;
      await user.save();
return res.status(200).json({ message: 'Verification code sent successfully' });
    // Step 4: Save the verification code to the user's record in the database  
  } catch (error) {   
    console.error('Error sending phone verification code:', error);
    return res.status(500).json({ error: 'Failed to send verification code' });
  }
  },
verifyPhone :async (req, res) => {
  try {
    // Find the user by userId
    const { phone, code } = req.body;
    if (!phone || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    // Return whether the phone is verified
    user.phoneVerified = true;
    user.verificationCode = null;
    await user.save();
    res.json({ message: 'Phone verified successfully' });
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ error: 'Phone verification failed' });
  }
},
deleteUser: async (req, res) => {
  try {
    // Check if the logged-in user is an admin
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const { userId } = req.params;
        console.log(userId);

    // Find the admin user using the decoded id (which is a string, but will work for comparison)
    const admin = await User.findOne({ id: decoded.id }); 
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }

    // Convert userId to number before querying if it's a string representation
    const userIdNumber = parseInt(userId, 10);
    // Find the user by ID and delete them
    const deletedUser = await User.findOneAndDelete({id:userId});
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user' });
  }
},


};

module.exports = authController;
