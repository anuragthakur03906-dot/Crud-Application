const mongoose = require('mongoose');

// ==================== USER SCHEMA DEFINITION ====================
// Defines structure and validation rules for User collection
const userSchema = new mongoose.Schema({

  // ==================== FIRST NAME FIELD ====================
  firstName: {
    type: String, // Data type: String
    required: [true, 'First name is required'], // Field is mandatory
    trim: true, // Removes extra spaces from both ends
    minlength: [2, 'First name must be at least 2 characters'], // Minimum length validation
    maxlength: [50, 'First name cannot exceed 50 characters'], // Maximum length validation
    match: [/^[A-Za-z\s]+$/, 'First name should contain only letters'] // Only alphabets allowed
  },

  // ==================== LAST NAME FIELD ====================
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters'],
    match: [/^[A-Za-z\s]+$/, 'Last name should contain only letters']
  },

  // ==================== EMAIL FIELD ====================
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ensures no duplicate emails in database
    trim: true,
    lowercase: true, // Converts email to lowercase before saving
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] // Email format validation
  },

  // ==================== PHONE FIELD ====================
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'] // Phone format validation
  }

}, {

  // ==================== TIMESTAMPS ====================
  // Automatically adds createdAt and updatedAt fields
  timestamps: true
});

// ==================== MODEL EXPORT ====================
// Creates and exports User model for database operations
module.exports = mongoose.model('User', userSchema);