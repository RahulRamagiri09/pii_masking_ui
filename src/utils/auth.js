// Authentication utility functions

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

// Save authentication data
export const saveAuthData = (token, user) => {
  console.log('💾 Saving auth data:');
  console.log('   Token length:', token ? token.length : 'null');
  console.log('   Token preview:', token ? token.substring(0, 30) + '...' : 'null');
  console.log('   User data:', user);

  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));

  // Verify storage worked
  const storedToken = localStorage.getItem('authToken');
  console.log('✅ Token storage verified:', storedToken ? 'Success' : 'Failed');
};

// Clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};