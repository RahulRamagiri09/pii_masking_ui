import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../../utils/auth';
import Navbar from '../Navbar/Navbar';

const Workflows = () => {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Workflows</h1>
          <p className="text-gray-600">
            Create and manage PII detection and masking workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">PII Detection Workflows</h3>
            <div className="text-gray-600">
              <p className="mb-4 text-sm">Automated workflows to discover PII in your data sources</p>
              <ul className="space-y-2">
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Scan databases for sensitive data
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Analyze file contents for PII
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Generate compliance reports
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Schedule automatic scans
                </li>
              </ul>
              <button className="w-full mt-4 text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity" style={{backgroundColor: '#0b2677'}}>
                Create Detection Workflow
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Data Masking Workflows</h3>
            <div className="text-gray-600">
              <p className="mb-4 text-sm">Automated workflows to mask or anonymize sensitive data</p>
              <ul className="space-y-2">
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Apply masking rules to datasets
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Tokenize sensitive information
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Generate anonymized copies
                </li>
                <li className="text-sm flex items-start">
                  <span className="font-bold mr-2" style={{color: '#0b2677'}}>•</span>
                  Batch processing capabilities
                </li>
              </ul>
              <button className="w-full mt-4 text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity" style={{backgroundColor: '#0b2677'}}>
                Create Masking Workflow
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Workflows</h3>
          <div className="text-gray-500 text-center py-8">
            <p>No workflows created yet.</p>
            <p className="text-sm mt-2">Create your first workflow to start processing PII data.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">0</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Active Workflows</p>
                <p className="text-xs text-blue-600">Currently running</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">0</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Completed Today</p>
                <p className="text-xs text-green-600">Successfully finished</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold text-sm">0</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">Pending</p>
                <p className="text-xs text-yellow-600">Waiting to execute</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workflows;