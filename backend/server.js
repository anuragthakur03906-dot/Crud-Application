const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// ==================== ENVIRONMENT CONFIGURATION ====================
// Load environment variables from .env file
dotenv.config();

// ==================== DATABASE CONNECTION ====================
// Establish connection with MongoDB database
connectDB();

const app = express();

// ==================== MIDDLEWARE SETUP ====================

/**
 * Enable Cross-Origin Resource Sharing (CORS)
 * Allows frontend to communicate with backend
 */
app.use(cors({
  origin: true, // Allows all origins (can be restricted in production)
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

/**
 * Parse incoming JSON requests
 */
app.use(express.json());

/**
 * Parse URL-encoded data (form submissions)
 */
app.use(express.urlencoded({ extended: true }));

// ==================== API ROUTES ====================

/**
 * User-related API routes
 * Base URL: /api/users
 */
app.use('/api/users', require('./routes/userRoutes'));

// ==================== HEALTH CHECK ROUTE ====================

/**
 * Root endpoint to check if API is running
 */
app.get('/', (req, res) => {
  res.json({ message: 'MERN CRUD API is running' });
});

// ==================== SERVER INITIALIZATION ====================

/**
 * Server port configuration
 */
const PORT = process.env.PORT || 5000;

/**
 * Start Express server
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});