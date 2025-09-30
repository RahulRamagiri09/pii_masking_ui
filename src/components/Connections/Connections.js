import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../../utils/auth';
import Navbar from '../Navbar/Navbar';

const Connections = () => {
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
    setUser(currentUser);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Connections</h1>
          <p className="text-gray-600">
            Manage your data source connections and integrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Database Connections</h3>
            <div className="text-gray-600">
              <p className="mb-4 text-sm">Connect to your databases for PII scanning</p>
              <ul className="space-y-2">
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  MySQL / MariaDB
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  PostgreSQL
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  SQL Server
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Oracle Database
                </li>
              </ul>
              <button className="w-full mt-4 text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity" style={{backgroundColor: '#0b2677'}}>
                Add Database Connection
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">File System Connections</h3>
            <div className="text-gray-600">
              <p className="mb-4 text-sm">Connect to file systems and storage</p>
              <ul className="space-y-2">
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Local File System
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  AWS S3
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Azure Blob Storage
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Google Cloud Storage
                </li>
              </ul>
              <button className="w-full mt-4 text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity" style={{backgroundColor: '#0b2677'}}>
                Add File Connection
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">API Connections</h3>
            <div className="text-gray-600">
              <p className="mb-4 text-sm">Connect to external APIs and services</p>
              <ul className="space-y-2">
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  REST APIs
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  GraphQL APIs
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Salesforce
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Microsoft 365
                </li>
              </ul>
              <button className="w-full mt-4 text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity" style={{backgroundColor: '#0b2677'}}>
                Add API Connection
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Active Connections</h3>
          <div className="text-gray-500 text-center py-8">
            <p>No connections configured yet.</p>
            <p className="text-sm mt-2">Add your first connection to get started with PII scanning.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connections;