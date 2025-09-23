import axios from 'axios';

// Configure base URL for API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('🔑 Token check:', token ? 'Token exists' : 'No token found');
    console.log('🔑 Full token value:', token);

    if (token && token.length > 0) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ API request with token:', config.url, 'Token preview:', token.substring(0, 20) + '...');
      console.log('🔒 Authorization header set:', config.headers.Authorization.substring(0, 30) + '...');
    } else {
      console.log('❌ API request without token:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🚨 API Error Details:');
    console.error('   Status:', error.response?.status);
    console.error('   URL:', error.config?.url);
    console.error('   Data:', error.response?.data);
    console.error('   Headers sent:', error.config?.headers);

    if (error.response?.status === 401) {
      console.error('🚨 401 UNAUTHORIZED - COMPLETE DEBUG INFO:');
      console.error('   URL:', error.config?.url);
      console.error('   Method:', error.config?.method?.toUpperCase());
      console.error('   Current token in localStorage:', localStorage.getItem('authToken'));
      console.error('   Authorization header sent:', error.config?.headers?.Authorization);
      console.error('   Request payload:', error.config?.data);
      console.error('   Complete backend response:', JSON.stringify(error.response?.data, null, 2));
      console.error('   Response headers:', error.response?.headers);
      console.error('   Current user from localStorage:', localStorage.getItem('user'));

      // Check if this is a business logic error (not auth failure)
      const errorDetail = error.response?.data?.detail || '';
      const isBusinessLogicError = errorDetail.includes('users already exist') ||
                                   errorDetail.includes('role') ||
                                   errorDetail.includes('permission');

      if (isBusinessLogicError) {
        console.log('🔍 This appears to be a business logic error, not an auth failure');
        console.log('   Not clearing auth data or redirecting');
        // Let the component handle this error - don't redirect
      } else {
        // Real authentication failure
        console.log('⏳ Waiting 5 seconds before clearing auth data...');
        setTimeout(() => {
          console.log('🧹 Clearing auth data and redirecting to login');
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');

          // Only redirect if we're not already on the login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 5000);
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => {
    return api.post('/api/auth/login', credentials);
  },
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
};

// Role APIs
export const roleAPI = {
  createRole: (roleData) => {
    return api.post('/api/roles', roleData);
  },
  getRoles: () => {
    return api.get('/api/roles');
  },
};

// User APIs
export const userAPI = {
  createUser: (userData) => {
    return api.post('/api/users', userData);
  },
  getUsers: () => {
    return api.get('/api/users');
  },
};

export default api;