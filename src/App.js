import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import POCDashboard from './components/POCDashboard/POCDashboard';
import POCConnectionsPage from './components/POCConnections/POCConnectionsPage';
import POCWorkflowsPage from './components/POCWorkflows/POCWorkflowsPage';
import CreateWorkflowPage from './components/POCWorkflows/CreateWorkflowPage';
import WorkflowDetailPage from './components/POCWorkflows/WorkflowDetailPage';
import RoleRegistration from './components/RoleRegistration/RoleRegistration';
import UserRegistration from './components/UserRegistration/UserRegistration';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes with copied POC components */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <POCDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
              <ProtectedRoute>
                <POCConnectionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflows"
            element={
              <ProtectedRoute>
                <POCWorkflowsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflows/create"
            element={
              <ProtectedRoute>
                <CreateWorkflowPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflows/:id"
            element={
              <ProtectedRoute>
                <WorkflowDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/register-role"
            element={
              <ProtectedRoute>
                <RoleRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-user"
            element={
              <ProtectedRoute>
                <UserRegistration />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
