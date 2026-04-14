import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import UserForm from './components/UserForm';

function App() {
  // ==================== STATE MANAGEMENT ====================
  
  /** State to store all users fetched from database */
  const [users, setUsers] = useState([]);
  
  /** Loading state to show spinner while fetching data */
  const [loading, setLoading] = useState(true);
  
  /** Controls visibility of add/edit form modal */
  const [showForm, setShowForm] = useState(false);
  
  /** Stores user data being edited (null for add mode) */
  const [editingUser, setEditingUser] = useState(null);
  
  /** Stores user data for delete confirmation modal */
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ==================== API CALLS ====================
  
  /**
   * Fetches all users from the backend API
   * Updates the users state and handles loading states
   */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // ==================== LIFECYCLE HOOKS ====================
  
  /**
   * Fetch users when component mounts
   * Empty dependency array ensures this runs only once
   */
  useEffect(() => {
    fetchUsers();
  }, []);

  // ==================== CRUD OPERATIONS ====================
  
  /**
   * Handles both create and update operations
   * @param {Object} userData - User data from form submission
   */
  const handleSubmit = async (userData) => {
    if (editingUser) {
      // Update existing user
      await updateUser(editingUser._id, userData);
      alert('User updated successfully!');
    } else {
      // Create new user
      await createUser(userData);
      alert('User created successfully!');
    }
    // Refresh the user list
    fetchUsers();
  };

  /**
   * Handles user deletion after confirmation
   * @param {string} id - User ID to delete
   */
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      alert('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
    setDeleteConfirm(null);
  };

  // ==================== RENDER COMPONENT ====================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ==================== HEADER SECTION ==================== */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 md:mb-8 transform transition-all hover:shadow-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            CRUD Database
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Manage your users efficiently
          </p>
        </div>

        {/* ==================== ADD BUTTON SECTION ==================== */}
        <div className="mb-4 sm:mb-6 flex justify-end">
          <button
            onClick={() => {
              setEditingUser(null);  // Reset editing mode
              setShowForm(true);     // Show form modal
            }}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg sm:rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm sm:text-base"
          >
            {/* Plus icon SVG */}
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Item</span>
          </button>
        </div>

        {/* ==================== USERS TABLE SECTION ==================== */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          {/* Horizontal scroll wrapper for mobile devices */}
          <div className="overflow-x-auto">
            <table className="min-w-[640px] sm:min-w-full w-full divide-y divide-gray-200">
              
              {/* Table Header */}
              <thead className="bg-gradient-to-r from-green-600 to-green-700">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    First
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Last
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                
                {/* Loading State */}
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-3 sm:px-4 md:px-6 py-8 text-center text-gray-500">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-green-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  /* Empty State - No Users Found */
                  <tr>
                    <td colSpan="6" className="px-3 sm:px-4 md:px-6 py-8 text-center text-gray-500 text-sm sm:text-base">
                      No users found. Click "Add Item" to create one.
                    </td>
                  </tr>
                ) : (
                  /* User Rows - Map through users array */
                  users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-green-50 transition-colors duration-200">
                      {/* Sequential ID (1, 2, 3...) */}
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {user.firstName}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {user.lastName}
                      </td>
                      {/* Email with truncation on mobile */}
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                        <span className="block truncate max-w-[120px] sm:max-w-none">
                          {user.email}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                        {user.phone}
                      </td>
                      {/* Action Buttons */}
                      <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 whitespace-nowrap text-xs sm:text-sm font-medium space-x-1 sm:space-x-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);  // Set user for editing
                            setShowForm(true);     // Show form modal
                          }}
                          className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs sm:text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user)}  // Show delete confirmation
                          className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs sm:text-sm font-medium"
                        >
                          Del
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-green-40 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 transform transition-all duration-300 mx-4 sm:mx-0">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                Confirm Delete
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Are you sure you want to delete{' '}
                <strong className="text-red-600">
                  {deleteConfirm.firstName} {deleteConfirm.lastName}
                </strong>?
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}  // Cancel deletion
                  className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm._id)}  // Confirm deletion
                  className="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ADD/EDIT USER FORM MODAL ==================== */}
        {showForm && (
          <UserForm
            user={editingUser}        // Pass user data for edit mode
            onSubmit={handleSubmit}   // Submit handler for form
            onClose={() => {
              setShowForm(false);     // Close form modal
              setEditingUser(null);   // Reset editing state
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;