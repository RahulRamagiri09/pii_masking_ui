import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userAPI, roleAPI } from '../../services/api';

const UserRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role_id: ''
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await roleAPI.getRoles();
      setRoles(response.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError('Failed to load roles. Please refresh the page.');
    } finally {
      setLoadingRoles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.role_id) {
      setError('Please select a role');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API - exclude confirmPassword
      const { confirmPassword, ...userData } = formData;

      await userAPI.createUser(userData);
      setSuccess('User registered successfully! Redirecting to login...');

      // Clear form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role_id: ''
      });

      // Redirect to login after success
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('User registration error:', error);
      setError(
        error.response?.data?.message ||
        'Failed to register user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8" style={{backgroundColor: '#0b2677'}}>
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">User Registration</h2>

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
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{borderColor: 'rgb(209, 213, 219)'}}
              onFocus={(e) => e.target.style.borderColor = '#0b2677'}
              onBlur={(e) => e.target.style.borderColor = 'rgb(209, 213, 219)'}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{borderColor: 'rgb(209, 213, 219)'}}
              onFocus={(e) => e.target.style.borderColor = '#0b2677'}
              onBlur={(e) => e.target.style.borderColor = 'rgb(209, 213, 219)'}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password (min. 6 characters)"
                disabled={loading}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{borderColor: 'rgb(209, 213, 219)'}}
                onFocus={(e) => e.target.style.borderColor = '#0b2677'}
                onBlur={(e) => e.target.style.borderColor = 'rgb(209, 213, 219)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                disabled={loading}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{borderColor: 'rgb(209, 213, 219)'}}
                onFocus={(e) => e.target.style.borderColor = '#0b2677'}
                onBlur={(e) => e.target.style.borderColor = 'rgb(209, 213, 219)'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showConfirmPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              id="role_id"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              required
              disabled={loading || loadingRoles}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{borderColor: 'rgb(209, 213, 219)'}}
              onFocus={(e) => e.target.style.borderColor = '#0b2677'}
              onBlur={(e) => e.target.style.borderColor = 'rgb(209, 213, 219)'}
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id || role._id} value={role.id || role._id}>
                  {role.name || role.rolename}
                </option>
              ))}
            </select>
            {loadingRoles && <span className="text-sm text-gray-500 mt-1 block">Loading roles...</span>}
          </div>

          <button
            type="submit"
            disabled={loading || loadingRoles}
            className="w-full text-white py-3 px-4 rounded-md font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            style={{backgroundColor: '#0b2677'}}
          >
            {loading ? 'Registering...' : 'Register User'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">Need to create a role first? <Link to="/register-role" className="font-medium hover:underline" style={{color: '#0b2677'}}>Create Role</Link></p>
          <p className="text-sm text-gray-600">Go back to <Link to="/dashboard" className="font-medium hover:underline" style={{color: '#0b2677'}}>Dashboard</Link></p>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;