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
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { connectionsAPI } from '../../services/api';
import CreateConnectionDialog from './CreateConnectionDialog';

const ConnectionsPage = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      setLoading(true);
      const response = await connectionsAPI.getAll();
      setConnections(response.data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConnection = async (connectionId) => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      try {
        await connectionsAPI.delete(connectionId);
        setConnections(connections.filter(conn => conn.id !== connectionId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'active':
        return (
          <Chip
            icon={<CheckIcon />}
            label="Active"
            color="success"
            size="small"
          />
        );
      case 'error':
        return (
          <Chip
            icon={<ErrorIcon />}
            label="Error"
            color="error"
            size="small"
          />
        );
      default:
        return (
          <Chip
            label="Inactive"
            color="default"
            size="small"
          />
        );
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Connection Name',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'connection_type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === 'azure_sql' ? 'Azure SQL' : 'Oracle'}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: 'server',
      headerName: 'Server',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'database',
      headerName: 'Database',
      width: 150,
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
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
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleDeleteConnection(params.row.id)}
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
            Database Connections
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your database connections for PII masking workflows
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Connection
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
            <StorageIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              Active Connections ({connections.length})
            </Typography>
          </Box>
          
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={connections}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              disableSelectionOnClick
              getRowId={(row) => row.id}
            />
          </Box>
        </CardContent>
      </Card>

      <CreateConnectionDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onConnectionCreated={() => {
          setCreateDialogOpen(false);
          loadConnections();
        }}
      />
    </Box>
  );
};

export default ConnectionsPage;
 