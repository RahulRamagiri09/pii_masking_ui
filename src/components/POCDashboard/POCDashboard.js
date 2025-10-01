import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Storage as StorageIcon,
  PlayArrow as PlayIcon,
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  PersonAdd as PersonAddIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { connectionsAPI, workflowsAPI } from '../../services/api';
import Navbar from '../Navbar/Navbar';
import { getCurrentUser } from '../../utils/auth';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0b2677',
    },
    secondary: {
      main: '#0b2677',
    },
  },
});

const POCDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [stats, setStats] = useState({
    connections: 0,
    workflows: 0,
    recentExecutions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [connectionsResponse, workflowsResponse] = await Promise.all([
        connectionsAPI.getAll(),
        workflowsAPI.getAll(),
      ]);

      // Handle different response structures safely
      const connectionsData = connectionsResponse.data?.data || connectionsResponse.data || [];
      const workflowsData = workflowsResponse.data?.data || workflowsResponse.data || [];

      setStats({
        connections: Array.isArray(connectionsData) ? connectionsData.length : 0,
        workflows: Array.isArray(workflowsData) ? workflowsData.length : 0,
        recentExecutions: Array.isArray(workflowsData) ? workflowsData.slice(0, 5) : [], // Show last 5 workflows
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'running':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckIcon />;
      case 'running':
        return <CircularProgress size={16} />;
      case 'failed':
        return <ErrorIcon />;
      default:
        return null;
    }
  };

  const dashboardContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Monitor your PII masking operations and database connections
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ width: '250px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <StorageIcon color="primary" />
                  <Typography variant="h4">{stats.connections}</Typography>
                  <Typography color="text.secondary">Connections</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ width: '250px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <PlayIcon color="primary" />
                  <Typography variant="h4">{stats.workflows}</Typography>
                  <Typography color="text.secondary">Workflows</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/connections')}
              >
                Add Connection
              </Button>
              <Button
                variant="outlined"
                startIcon={<PlayIcon />}
                onClick={() => navigate('/workflows/create')}
              >
                Create Workflow
              </Button>
              <Button
                variant="outlined"
                startIcon={<PersonAddIcon />}
                onClick={() => navigate('/register-user')}
              >
                Register New User
              </Button>
              <Button
                variant="outlined"
                startIcon={<SecurityIcon />}
                onClick={() => navigate('/register-role')}
              >
                Create New Role
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/workflows')}
              >
                View All Workflows
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Recent Workflows */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Workflows
            </Typography>
            {stats.recentExecutions.length === 0 ? (
              <Typography color="text.secondary">
                No workflows created yet. Start by creating your first workflow.
              </Typography>
            ) : (
              <Box>
                {stats.recentExecutions.map((workflow) => (
                  <Box
                    key={workflow.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    py={1}
                    borderBottom="1px solid #e0e0e0"
                  >
                    <Box>
                      <Typography variant="subtitle1">{workflow.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {workflow.description || 'No description'}
                      </Typography>
                    </Box>
                    <Chip
                      icon={getStatusIcon(workflow.status)}
                      label={workflow.status.toUpperCase()}
                      color={getStatusColor(workflow.status)}
                      size="small"
                    />
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar user={user} />
      <div className="flex-1 overflow-auto">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ maxWidth: 'xl', mx: 'auto', mt: 3, mb: 3, px: 3 }}>
            {dashboardContent()}
          </Box>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default POCDashboard;