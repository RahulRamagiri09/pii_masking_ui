import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { workflowsAPI } from '../../services/api';
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

const POCWorkflowsPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const response = await workflowsAPI.getAll();

      // Handle different response structures safely
      const data = response.data?.data || response.data || [];
      setWorkflows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setWorkflows([]); // Ensure workflows is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkflow = async (workflowId) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await workflowsAPI.delete(workflowId);
        setWorkflows(workflows.filter(workflow => workflow.id !== workflowId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'completed':
        return (
          <Chip
            icon={<CheckIcon />}
            label="Completed"
            color="success"
            size="small"
          />
        );
      case 'running':
        return (
          <Chip
            icon={<PlayIcon />}
            label="Running"
            color="warning"
            size="small"
          />
        );
      case 'failed':
        return (
          <Chip
            icon={<ErrorIcon />}
            label="Failed"
            color="error"
            size="small"
          />
        );
      case 'pending':
        return (
          <Chip
            icon={<ScheduleIcon />}
            label="Pending"
            color="default"
            size="small"
          />
        );
      default:
        return (
          <Chip
            icon={<ScheduleIcon />}
            label="Draft"
            color="default"
            size="small"
          />
        );
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Workflow Namesssss',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 300,
    },
    {
      field: 'connection_name',
      headerName: 'Connection',
      width: 150,
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => navigate(`/workflows/${params.row.id}`)}
            color="primary"
            title="View Details"
          >
            <ViewIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteWorkflow(params.row.id)}
            color="error"
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const workflowsContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Workflows
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Create and manage PII masking workflows
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/workflows/create')}
          >
            Create Workflow
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <PlayIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                All Workflows ({workflows?.length || 0})
              </Typography>
            </Box>

            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={workflows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                getRowId={(row) => row.id}
              />
            </Box>
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
            {workflowsContent()}
          </Box>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default POCWorkflowsPage;