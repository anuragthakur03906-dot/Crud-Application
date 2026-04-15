import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Base URL 
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling
api.interceptors.response.use(
  res => res,
  err => {
    console.log(err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const getUsers = () => api.get('/users');
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;