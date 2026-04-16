import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

/**
 * Validation schema using Yup
 * Defines validation rules for form fields including firstName, lastName, email, and phone
 */
const validationSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'Only alphabets allowed')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .required('First name is required'),

  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'Only alphabets allowed')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .required('Last name is required'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, 'Invalid phone number')
    .required('Phone number is required'),
});

/**
 * UserForm Component
 * Reusable modal form used for creating and updating user data
 *
 * Props:
 * @param {Object|null} user - Existing user object for edit mode, null for create mode
 * @param {Function} onSubmit - Callback function executed on form submission
 * @param {Function} onClose - Callback function to close the modal
 */
const UserForm = ({ user, onSubmit, onClose }) => {

  /**
   * Formik hook for form state management, validation, and submission handling
   * Handles form values, touched fields, validation errors, and submit state
   */
  const formik = useFormik({
    // Initial form values (supports both create and edit mode)
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },

    // Attach Yup validation schema
    validationSchema,

    // Reinitialize form values when user prop changes
    enableReinitialize: true,

    /**
     * Handle form submission
     * Calls parent submit function and manages success/error states
     */
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await onSubmit(values);
        onClose(); // Close modal on successful submission
      } catch (error) {
        // Handle API/server-side errors
        setErrors({
          submit: error.response?.data?.message || 'An error occurred'
        });
      } finally {
        // Reset submitting state after request completion
        setSubmitting(false);
      }
    },
  });

  return (
    /**
     * Modal overlay with background blur effect
     * Centers the form in viewport
     */
    <div className="fixed inset-0 bg-blue-30 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">

      {/* Modal container */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 mx-4 sm:mx-0">

        {/* Modal header section */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl sm:rounded-t-2xl">

          {/* Dynamic title based on mode */}
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {user ? 'Edit User' : 'Add New User'}
          </h2>

          {/* Close modal button */}
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-600 hover:bg-opacity-20 rounded-full p-1 transition-all duration-200 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base"
          >
            ✕
          </button>

        </div>

        {/* Form section */}
        <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">

          {/* First Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              First Name *
            </label>

            <input
              type="text"
              name="firstName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
              className={`w-full px-3 sm:px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                formik.touched.firstName && formik.errors.firstName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />

            {/* Validation error message */}
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {formik.errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Last Name *
            </label>

            <input
              type="text"
              name="lastName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
              className={`w-full px-3 sm:px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                formik.touched.lastName && formik.errors.lastName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />

            {/* Validation error message */}
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {formik.errors.lastName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Email *
            </label>

            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`w-full px-3 sm:px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />

            {/* Validation error message */}
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Phone *
            </label>

            <input
              type="tel"
              name="phone"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              className={`w-full px-3 sm:px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                formik.touched.phone && formik.errors.phone
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />

            {/* Validation error message */}
            {formik.touched.phone && formik.errors.phone && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {formik.errors.phone}
              </p>
            )}
          </div>

          {/* Action buttons section */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">

            {/* Cancel button */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm sm:text-base"
            >
              Cancel
            </button>

            {/* Submit button */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 shadow-md text-sm sm:text-base"
            >
              {formik.isSubmitting ? 'Saving...' : user ? 'Update' : 'Create'}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default UserForm;