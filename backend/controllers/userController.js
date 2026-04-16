const User = require('../models/User');

// ==================== REGEX VALIDATIONS ====================

// Regex to allow only alphabets and spaces for names
const nameRegex = /^[A-Za-z\s]+$/;

// Regex to validate phone number (10–15 digits only)
const phoneRegex = /^[0-9]{10,15}$/;


// ==================== GET ALL USERS ====================
/**
 * Fetch all users from database
 * Sorted by latest created users first
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};


// ==================== CREATE USER ====================
/**
 * Create a new user after validating input fields
 */
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    // ==================== NAME VALIDATION ====================
    if (!nameRegex.test(firstName)) {
      return res.status(400).json({
        success: false,
        message: 'First name should contain only letters'
      });
    }

    if (!nameRegex.test(lastName)) {
      return res.status(400).json({
        success: false,
        message: 'Last name should contain only letters'
      });
    }

    // ==================== PHONE VALIDATION ====================
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone must be 10 to 15 digits only'
      });
    }

    // ==================== EMAIL DUPLICATE CHECK ====================
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // ==================== CREATE USER ====================
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone
    });

    res.status(201).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// ==================== UPDATE USER ====================
/**
 * Update existing user by ID
 * Includes validation and duplicate email check
 */
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    // Find user by ID
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // ==================== NAME VALIDATION ====================
    if (firstName && !nameRegex.test(firstName)) {
      return res.status(400).json({
        success: false,
        message: 'First name should contain only letters'
      });
    }

    if (lastName && !nameRegex.test(lastName)) {
      return res.status(400).json({
        success: false,
        message: 'Last name should contain only letters'
      });
    }

    // ==================== PHONE VALIDATION ====================
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone must be 10 to 15 digits only'
      });
    }

    // ==================== EMAIL DUPLICATE CHECK ====================
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // ==================== BUILD UPDATE OBJECT ====================
    const updateData = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    // ==================== UPDATE USER ====================
    user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,          // Return updated document
        runValidators: true // Apply schema validations
      }
    );

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// ==================== DELETE USER ====================
/**
 * Delete user by ID after checking existence
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user from database
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==================== EXPORT CONTROLLERS ====================
module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};