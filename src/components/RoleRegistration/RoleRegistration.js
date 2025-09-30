import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { roleAPI } from '../../services/api';

const RoleRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rolename: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await roleAPI.createRole(formData);
      setSuccess('Role created successfully!');

      // Clear form
      setFormData({ rolename: '' });

      // Optionally redirect after a delay
      setTimeout(() => {
        navigate('/register-user');
      }, 2000);
    } catch (error) {
      console.error('Role registration error:', error);

      // Handle specific backend error messages
      const errorDetail = error.response?.data?.detail || '';
      let errorMessage;

      if (errorDetail.includes('users already exist')) {
        errorMessage = 'Cannot create roles - users already exist in the system. Roles must be created before any users are registered.';
      } else if (errorDetail.includes('Authentication required')) {
        errorMessage = errorDetail;
      } else {
        errorMessage = error.response?.data?.message ||
                      error.response?.data?.detail ||
                      'Failed to create role. Please try again.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#0b2677'}}>
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Create New Role</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm text-center">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="rolename" className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
            <input
              type="text"
              id="rolename"
              name="rolename"
              value={formData.rolename}
              onChange={handleChange}
              required
              placeholder="Enter role name (e.g., Admin, User, Manager)"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{borderColor: 'rgb(209, 213, 219)'}}
              onFocus={(e) => e.target.style.borderColor = '#0b2677'}
              onBlur={(e) => e.target.style.borderColor = 'rgb(209, 213, 219)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.rolename.trim()}
            className="w-full text-white py-3 px-4 rounded-md font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            style={{backgroundColor: '#0b2677'}}
          >
            {loading ? 'Creating Role...' : 'Create Role'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">Need to create a user? <Link to="/register-user" className="font-medium hover:underline" style={{color: '#0b2677'}}>Register User</Link></p>
          <p className="text-sm text-gray-600">Go back to <Link to="/dashboard" className="font-medium hover:underline" style={{color: '#0b2677'}}>Dashboard</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RoleRegistration;