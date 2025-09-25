import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);

    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'Server error';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error - please check your connection');
    } else {
      // Something else happened
      throw new Error('Request failed');
    }
  }
);

// Database Connections API
export const connectionsAPI = {
  getAll: () => api.get('/connections'),
  create: (connectionData) => api.post('/connections', connectionData),
  getById: (id) => api.get(`/connections/${id}`),
  delete: (id) => api.delete(`/connections/${id}`),
  test: (connectionData) => api.post('/connections/test', connectionData),
  getTables: (connectionId) => api.get(`/connections/${connectionId}/tables`),
  getSourceTables: (connectionId) => api.get(`/connections/${connectionId}/source_tables`),
  getDestinationTables: (connectionId) => api.get(`/connections/${connectionId}/destination_tables`),
  getTableColumns: (connectionId, tableName) =>
    api.get(`/connections/${connectionId}/tables/${tableName}/columns`),
  getSourceTableColumns: (connectionId, tableName) =>
    api.get(`/connections/${connectionId}/sources_tables/${tableName}/columns`),
};

// Workflows API
export const workflowsAPI = {
  getAll: () => api.get('/workflows'),
  create: (workflowData) => api.post('/workflows', workflowData),
  getById: (id) => api.get(`/workflows/${id}`),
  update: (id, workflowData) => api.put(`/workflows/${id}`, workflowData),
  delete: (id) => api.delete(`/workflows/${id}`),
  getExecutions: (workflowId) => api.get(`/workflows/${workflowId}/executions`),
  getPiiAttributes: () => api.get('/workflows/pii-attributes'),
};

// Masking API
export const maskingAPI = {
  executeWorkflow: (workflowId) => api.post(`/masking/execute/${workflowId}`),
  getExecutionStatus: (executionId) => api.get(`/masking/execution/${executionId}/status`),
  generateSampleData: (piiAttribute, count = 5) =>
    api.post('/masking/sample-data', { pii_attribute: piiAttribute, count }),
  validateWorkflow: (workflowId) => api.post('/masking/validate-workflow', { workflow_id: workflowId }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
