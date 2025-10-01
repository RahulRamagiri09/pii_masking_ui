import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { saveAuthData } from '../../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: 'rahul',
    password: 'Test@123'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 LOGIN ATTEMPT STARTED');
    console.log('   Username:', formData.username);
    console.log('   Password length:', formData.password.length);

    try {
      console.log('📡 Calling authAPI.login...');
      const response = await authAPI.login(formData);

      // Debug: Log the actual response to see the structure
      console.log('✅ Login response received:', response.data);

      // Handle different possible response formats
      let token = response.data.token || response.data.access_token || response.data.accessToken;
      let user = response.data.user || { username: formData.username };

      // Debug: Log the extracted token
      console.log('Extracted token:', token);

      if (!token) {
        console.error('No token found in response:', response.data);
        setError('Authentication failed - no token received');
        return;
      }

      // Save authentication data
      saveAuthData(token, user);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ LOGIN ERROR:', error);
      console.error('   Error type:', error.constructor.name);
      console.error('   Error message:', error.message);
      console.error('   Response status:', error.response?.status);
      console.error('   Response data:', error.response?.data);
      console.error('   Request config:', error.config);

      if (error.message.includes('Network Error') || error.message.includes('CORS')) {
        console.error('🚨 CORS/Network error detected!');
      }

      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to login. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Centered Container */}
      <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full mx-4">
        {/* Left Section - Logo */}
        <div className="w-1/2 flex items-center justify-center p-12" style={{backgroundColor: '#0b2677'}}>
          <div className="text-center">
            <img
              src="/logo192.png"
              alt="PII Masking Tool Logo"
              className="w-48 h-48 mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-white mb-2">PII Masking Tool</h1>
            <p className="text-white text-base opacity-90">Secure Your Sensitive Data</p>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-1/2 flex items-center justify-center bg-white p-12">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
              {error}
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
              placeholder="Enter your username"
              disabled={loading}
              autoComplete="off"
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
                placeholder="Enter your password"
                disabled={loading}
                autoComplete="off"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-3 px-4 rounded-md font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            style={{backgroundColor: '#0b2677'}}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">After login, access user registration and role creation from the Dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;