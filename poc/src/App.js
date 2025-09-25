import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import ConnectionsPage from './components/Connections/ConnectionsPage';
import WorkflowsPage from './components/Workflows/WorkflowsPage';
import CreateWorkflowPage from './components/Workflows/CreateWorkflowPage';
import WorkflowDetailPage from './components/Workflows/WorkflowDetailPage';
import Chatbot from './components/Chatbot/Chatbot';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3, flex: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/workflows" element={<WorkflowsPage />} />
          <Route path="/workflows/create" element={<CreateWorkflowPage />} />
          <Route path="/workflows/:id" element={<WorkflowDetailPage />} />
        </Routes>
      </Container>
      <Chatbot />
    </Box>
  );
}

export default App;