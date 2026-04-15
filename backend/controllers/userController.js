const User = require('../models/User');

// ==================== REGEX ====================

// Only letters (allow spaces also)
const nameRegex = /^[A-Za-z\s]+$/;

// Phone: 10–15 digits only
const phoneRegex = /^[0-9]{10,15}$/;


// ==================== GET USERS ====================
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
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    //  NAME VALIDATION
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

    //  PHONE VALIDATION
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone must be 10 to 15 digits only'
      });
    }

    //  EMAIL CHECK
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

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
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    //  NAME VALIDATION (only if provided)
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

    //  PHONE VALIDATION
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone must be 10 to 15 digits only'
      });
    }

    // EMAIL CHECK
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // UPDATE
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;

    user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
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
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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


module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};