import axios from 'axios';

// ==================== BASE API CONFIGURATION ====================

/**
 * Base API URL from environment variables
 */
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Axios instance with default configuration
 * Used for all API requests
 */
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== RESPONSE INTERCEPTOR ====================

/**
 * Handles all API responses globally
 * Logs errors and forwards them to calling function
 */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log(err.response?.data || err.message);
    return Promise.reject(err);
  }
);

// ==================== USER API SERVICES ====================

/**
 * Fetch all users from backend
 */
export const getUsers = () => api.get('/users');

/**
 * Create a new user
 * @param {Object} userData - User data payload
 */
export const createUser = (userData) => api.post('/users', userData);

/**
 * Update existing user by ID
 * @param {string} id - User ID
 * @param {Object} userData - Updated user data
 */
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);

/**
 * Delete user by ID
 * @param {string} id - User ID
 */
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ==================== EXPORT DEFAULT ====================

export default api;