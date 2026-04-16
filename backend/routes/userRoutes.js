const express = require('express');

// ==================== CONTROLLERS IMPORT ====================
// Import all user-related controller functions
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// ==================== ROUTER INITIALIZATION ====================
// Create a new Express router instance
const router = express.Router();

// ==================== USER COLLECTION ROUTES ====================

/**
 * Routes for /api/users
 * Handles fetching all users and creating new user
 */
router.route('/')
  .get(getUsers)     // GET: Fetch all users
  .post(createUser); // POST: Create a new user

// ==================== SINGLE USER ROUTES ====================

/**
 * Routes for /api/users/:id
 * Handles update and delete operations for specific user
 */
router.route('/:id')
  .put(updateUser)    // PUT: Update user by ID
  .delete(deleteUser); // DELETE: Remove user by ID

// ==================== EXPORT ROUTER ====================
// Export router to be used in main server file
module.exports = router;