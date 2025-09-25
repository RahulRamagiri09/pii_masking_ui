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

const WorkflowsPage = () => {
  const navigate = useNavigate();
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
      setWorkflows(response.data.data);
    } catch (err) {
      setError(err.message);
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
            icon={<CircularProgress size={16} />}
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
      case 'ready':
        return (
          <Chip
            icon={<CheckIcon />}
            label="Ready"
            color="primary"
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
      headerName: 'Workflow Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => params.value || 'No description',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'updated_at',
      headerName: 'Last Updated',
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => navigate(`/workflows/${params.row.id}`)}
            color="primary"
          >
            <ViewIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => navigate(`/workflows/${params.row.id}?tab=execute`)}
            color="success"
            disabled={params.row.status === 'running'}
          >
            <PlayIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteWorkflow(params.row.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

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
            Mask & Copy Workflows
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create and manage PII masking workflows for data migration
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
              All Workflows ({workflows.length})
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

export default WorkflowsPage;
 