const mongoose = require('mongoose');

// ==================== DATABASE CONNECTION FUNCTION ====================

/**
 * Connects application to MongoDB database using Mongoose
 */
const connectDB = async () => {
  try {

    // ==================== CONNECT TO MONGODB ====================
    await mongoose.connect(process.env.MONGODB_URL);

    // Log success message after successful connection
    console.log('MongoDB Connected Successfully');

  } catch (error) {

    // ==================== ERROR HANDLING ====================
    // Log connection error details
    console.error('MongoDB Connection Error:', error);

    // Exit process with failure status
    process.exit(1);
  }
};

// ==================== EXPORT DATABASE CONNECTION ====================
// Export function to be used in server startup file
module.exports = connectDB;