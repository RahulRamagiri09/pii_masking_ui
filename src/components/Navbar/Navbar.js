import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearAuthData } from '../../utils/auth';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navButtons = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Connections', path: '/connections' },
    { name: 'Workflows', path: '/workflows' }
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <h2 className="text-xl lg:text-2xl font-bold text-white">PII Masking Tool</h2>

            {/* Navigation Buttons */}
            <div className="hidden md:flex space-x-1">
              {navButtons.map((button) => (
                <button
                  key={button.name}
                  onClick={() => navigate(button.path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(button.path)
                      ? 'bg-white bg-opacity-25 text-white shadow-md border border-white border-opacity-30'
                      : 'text-white hover:text-white hover:bg-white hover:bg-opacity-15 border border-transparent hover:border-white hover:border-opacity-20'
                  }`}
                >
                  {button.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile menu for navigation buttons */}
            <div className="md:hidden">
              <select
                onChange={(e) => navigate(e.target.value)}
                value={location.pathname}
                className="bg-white bg-opacity-20 text-white text-sm rounded-md px-2 py-1 border border-white border-opacity-30"
              >
                {navButtons.map((button) => (
                  <option key={button.name} value={button.path} className="text-black">
                    {button.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-white text-xs sm:text-sm">
              Welcome, {user?.username || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-indigo-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;