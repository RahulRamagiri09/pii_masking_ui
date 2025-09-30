import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearAuthData } from '../../utils/auth';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navButtons = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Connections', path: '/connections' },
    { name: 'Workflows', path: '/workflows' }
  ];

  return (
    <nav className="shadow-lg" style={{backgroundColor: '#0b2677'}}>
      <div className="flex justify-between items-center py-4 px-4">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center space-x-2">
            <img
              src="/logo192.png"
              alt="PII Masking Tool Logo"
              className="h-8 w-8 lg:h-10 lg:w-10"
            />
            <h2 className="text-xl lg:text-2xl font-bold text-white">PII Masking Tool</h2>
          </div>

          {/* Right Section - Navigation Buttons and Profile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
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

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-white hover:bg-white hover:bg-opacity-15 px-3 py-2 rounded-md transition-all duration-200"
              >
                {/* Profile Icon */}
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium">{user?.username || 'User'}</span>
                {/* Dropdown arrow */}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.username || 'User'}</div>
                    <div className="text-xs text-gray-500">{user?.email || 'No email'}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16,17 21,12 16,7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;