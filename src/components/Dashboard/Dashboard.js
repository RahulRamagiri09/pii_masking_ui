import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../../utils/auth';
import { roleAPI } from '../../services/api';
import Navbar from '../Navbar/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get current user data
    const currentUser = getCurrentUser();
    console.log('📋 Dashboard - Current user data:', currentUser);
    console.log('📋 Dashboard - User role:', currentUser?.role);
    setUser(currentUser);
  }, [navigate]);

  const testGetRoles = async () => {
    try {
      console.log('🔍 Testing GET roles...');
      const response = await roleAPI.getRoles();
      console.log('✅ GET roles success:', response.data);
      alert('GET roles works! Check console for details.');
    } catch (error) {
      console.error('❌ GET roles failed:', error);
      alert('GET roles failed - check console for details');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Dashboard</h1>
          <p className="text-gray-600">
            Welcome to the PII Masking Tool Dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">User Profile</h3>
            <div className="space-y-3">
              <p className="text-sm"><span className="font-medium text-gray-700">Username:</span> <span className="text-gray-600">{user?.username || 'N/A'}</span></p>
              <p className="text-sm"><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-600">{user?.email || 'N/A'}</span></p>
              <p className="text-sm"><span className="font-medium text-gray-700">Role:</span> <span className="text-gray-600">{user?.role || 'N/A'}</span></p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/register-user')}
                className="w-full text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity"
                style={{backgroundColor: '#0b2677'}}
              >
                Register New User
              </button>
              <button
                onClick={() => navigate('/register-role')}
                className="w-full text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity"
                style={{backgroundColor: '#0b2677'}}
              >
                Create New Role
              </button>
              <button
                onClick={testGetRoles}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 transition-colors"
              >
                🔍 Test GET Roles
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">PII Masking Features</h3>
            <div className="text-gray-600">
              <p className="mb-4 text-sm">Coming soon...</p>
              <ul className="space-y-2">
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Upload documents for PII detection
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Automatic PII masking
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Export masked documents
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  View masking history
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">System Status</h3>
            <div className="space-y-3">
              <p className="text-sm text-green-600 font-semibold">System is operational</p>
              <p className="text-sm text-gray-600">Last login: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;