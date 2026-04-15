import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import UserForm from './components/UserForm';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (userData) => {
    if (editingUser) {
      await updateUser(editingUser._id, userData);
      alert('User updated successfully!');
    } else {
      await createUser(userData);
      alert('User created successfully!');
    }
    fetchUsers();
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 md:p-8">

      <div className="max-w-screen-xl 2xl:max-w-screen-2xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
            CRUD Database
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-2">
            Manage your users efficiently
          </p>
        </div>

        {/* ADD BUTTON */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base lg:text-lg"
          >
            <span>Add Item</span>
          </button>
        </div>

        {/* USERS SECTION */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">

          {/* MOBILE VIEW */}
          <div className="block sm:hidden p-4 space-y-3">
            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : users.length === 0 ? (
              <div className="text-center text-gray-500">No users found</div>
            ) : (
              users.map((user, index) => (
                <div key={user._id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-sm font-bold">
                    {index + 1} {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-600 break-all mt-1">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {user.phone}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setShowForm(true);
                      }}
                      className="flex-1 py-1 bg-blue-600 text-white rounded text-xs"
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

          {/* DESKTOP TABLE */}
          <div className="hidden sm:block w-full overflow-x-hidden">
            <table className="w-full table-auto divide-y divide-gray-200">

              {/* HEADER */}
              <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <tr>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">ID</th>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">First</th>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">Last</th>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">Email</th>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">Phone</th>
                  <th className="px-6 lg:px-8 py-4 text-left text-sm lg:text-base uppercase">Actions</th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-green-50 hover:scale-[1.01] transition-all duration-200"
                  >
                    <td className="px-6 lg:px-8 py-4 text-base lg:text-lg font-semibold">
                      {index + 1}
                    </td>
                    <td className="px-6 lg:px-8 py-4 text-base lg:text-lg">
                      {user.firstName}
                    </td>
                    <td className="px-6 lg:px-8 py-4 text-base lg:text-lg">
                      {user.lastName}
                    </td>
                    <td className="px-6 lg:px-8 py-4 text-base lg:text-lg max-w-[250px] truncate">
                      {user.email}
                    </td>
                    <td className="px-6 lg:px-8 py-4 text-base lg:text-lg">
                      {user.phone}
                    </td>
                    <td className="px-6 lg:px-8 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowForm(true);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm lg:text-base"
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

      {/* DELETE MODAL */}
{deleteConfirm && (
  <div className="fixed inset-0 bg-green-30 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    
    <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 w-full max-w-sm sm:max-w-md lg:max-w-lg transition-all duration-300">
      
      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 text-gray-800">
        Confirm Delete
      </h3>

      <p className="mb-5 text-sm sm:text-base lg:text-lg text-gray-600">
        Delete{" "}
        <strong className="text-red-600">
          {deleteConfirm.firstName} {deleteConfirm.lastName}
        </strong>{" "}
        ?
      </p>

      <div className="flex gap-2 sm:gap-3">
        
        {/* CANCEL BUTTON */}
        <button
          onClick={() => setDeleteConfirm(null)}
          className="flex-1 border-2 border-gray-300 py-2 sm:py-3 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-200"
        >
          Cancel
        </button>

        {/* DELETE BUTTON */}
        <button
          onClick={() => handleDelete(deleteConfirm._id)}
          className="flex-1 bg-red-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-red-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}

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