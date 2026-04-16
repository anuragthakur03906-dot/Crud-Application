import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import UserForm from './components/UserForm';

function App() {

  // ==================== STATE MANAGEMENT ====================

  /**
   * Stores list of users fetched from API
   */
  const [users, setUsers] = useState([]);

  /**
   * Loading state for API requests
   */
  const [loading, setLoading] = useState(true);

  /**
   * Controls visibility of Add/Edit user form modal
   */
  const [showForm, setShowForm] = useState(false);

  /**
   * Stores user data when editing existing user
   * If null → create mode
   */
  const [editingUser, setEditingUser] = useState(null);

  /**
   * Stores user selected for delete confirmation
   */
  const [deleteConfirm, setDeleteConfirm] = useState(null);


  // ==================== API CALLS ====================

  /**
   * Fetch all users from backend API
   * Updates users state with response data
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


  // ==================== LIFECYCLE METHOD ====================

  /**
   * Runs once when component mounts
   * Fetches initial users list
   */
  useEffect(() => {
    fetchUsers();
  }, []);


  // ==================== CRUD OPERATIONS ====================

  /**
   * Handles create and update user operations
   * If editingUser exists → update else create
   */
  const handleSubmit = async (userData) => {
    if (editingUser) {
      await updateUser(editingUser._id, userData);
      alert('User updated successfully!');
    } else {
      await createUser(userData);
      alert('User created successfully!');
    }

    // Refresh users list after operation
    fetchUsers();
  };


  /**
   * Handles delete user operation
   * Removes user by ID and refreshes list
   */
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      alert('User deleted successfully!');

      // Refresh updated list
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }

    // Close confirmation modal
    setDeleteConfirm(null);
  };


  // ==================== UI RENDER ====================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">

      <div className="max-w-screen-xl 2xl:max-w-screen-2xl mx-auto">

        {/* ==================== HEADER SECTION ==================== */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-6">

          {/* Application Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            CRUD Database
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-2">
            Manage your users efficiently
          </p>

        </div>

        {/* ==================== ADD USER BUTTON ==================== */}
        <div className="mb-6 flex justify-end">

          <button
            onClick={() => {
              setEditingUser(null); // Reset edit mode
              setShowForm(true);    // Open form modal
            }}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg"
          >
            <span>Add Item</span>
          </button>

        </div>

        {/* ==================== USERS LIST SECTION ==================== */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">

          {/* ==================== MOBILE VIEW ==================== */}
          <div className="block sm:hidden p-4 space-y-3">

            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : users.length === 0 ? (
              <div className="text-center text-gray-500">No users found</div>
            ) : (
              users.map((user, index) => (
                <div key={user._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">

                  {/* User Name */}
                  <p className="text-sm font-bold">
                    {index + 1} {user.firstName} {user.lastName}
                  </p>

                  {/* Email */}
                  <p className="text-xs text-gray-600 break-all mt-1">
                    {user.email}
                  </p>

                  {/* Phone */}
                  <p className="text-xs text-gray-600 mt-1">
                    {user.phone}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">

                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}
                      className="flex-1 py-1 bg-green-600 text-white rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(user)}
                      className="flex-1 py-1 bg-red-600 text-white rounded text-xs"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))
            )}
          </div>

          {/* ==================== DESKTOP TABLE VIEW ==================== */}
          <div className="hidden sm:block w-full overflow-x-hidden">

            <table className="w-full table-auto divide-y divide-gray-200">

              {/* Table Header */}
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">ID</th>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">First</th>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">Last</th>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">Email</th>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">Phone</th>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id} className="border-t hover:bg-blue-50">

                    <td className="px-6 lg:px-8 py-4">{index + 1}</td>
                    <td className="px-6 lg:px-8 py-4">{user.firstName}</td>
                    <td className="px-6 lg:px-8 py-4">{user.lastName}</td>
                    <td className="px-6 lg:px-8 py-4">{user.email}</td>
                    <td className="px-6 lg:px-8 py-4">{user.phone}</td>

                    {/* Action Buttons */}
                    <td className="px-6 lg:px-8 py-4">
                      <div className="flex gap-3">

                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowForm(true);
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm lg:text-base"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => setDeleteConfirm(user)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm lg:text-base"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* ==================== DELETE CONFIRM MODAL ==================== */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-blue-30 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">

              {/* Modal Title */}
              <h3 className="text-xl font-bold mb-3">Confirm Delete</h3>

              {/* Confirmation Message */}
              <p className="mb-5">
                Delete{" "}
                <strong className="text-red-600">
                  {deleteConfirm.firstName} {deleteConfirm.lastName}
                </strong> ?
              </p>

              {/* Modal Actions */}
              <div className="flex gap-3">

                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 border py-2 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleDelete(deleteConfirm._id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        )}

        {/* ==================== USER FORM MODAL ==================== */}
        {showForm && (
          <UserForm
            user={editingUser}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setEditingUser(null);
            }}
          />
        )}

      </div>
    </div>
  );
}

export default App;