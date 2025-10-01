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
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { workflowsAPI, maskingAPI, connectionsAPI } from '../../services/api';
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

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workflow-tabpanel-${index}`}
      aria-labelledby={`workflow-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const WorkflowDetailPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { id: workflowId } = useParams();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'execute' ? 1 : 0;

  const [tabValue, setTabValue] = useState(initialTab);
  const [workflow, setWorkflow] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [executeDialog, setExecuteDialog] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [currentExecution, setCurrentExecution] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  useEffect(() => {
    loadWorkflowData();
    loadConnections();
  }, [workflowId]);

  // useEffect(() => {
  //   let interval;
  //   if (currentExecution && (currentExecution.status === 'running' || currentExecution.status === 'queued')) {
  //     interval = setInterval(checkExecutionStatus, 3000); // Poll every 3 seconds
  //   }
  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [currentExecution]);

  const loadWorkflowData = async () => {
    try {
      setLoading(true);
      const [workflowRes, executionsRes] = await Promise.all([
        workflowsAPI.getById(workflowId),
        workflowsAPI.getExecutions(workflowId)
      ]);

      // Handle different response structures safely
      const workflowData = workflowRes.data?.data || workflowRes.data;
      const executionsData = executionsRes.data?.data || executionsRes.data || [];

      setWorkflow(workflowData);
      setExecutions(Array.isArray(executionsData) ? executionsData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const response = await connectionsAPI.getAll();

      // Handle different response structures safely
      const data = response.data?.data || response.data || [];
      setConnections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load connections:', err);
      setConnections([]);
    }
  };

  const checkExecutionStatus = async () => {
    if (!currentExecution) return;

    try {
      const response = await maskingAPI.getExecutionStatus(workflowId, currentExecution.execution_id || currentExecution.id);
      const updatedExecution = response.data?.data || response.data;

      setCurrentExecution(updatedExecution);

      if (updatedExecution.status === 'completed' || updatedExecution.status === 'failed') {
        setCurrentExecution(null);
        setExecuting(false);
        loadWorkflowData();
      }
    } catch (err) {
      console.error('Failed to check execution status:', err);
    }
  };

  const handleExecuteWorkflow = async () => {
    try {
      setExecuting(true);
      setError(null);

      const response = await maskingAPI.executeWorkflow(workflowId);
      const result = response.data?.data || response.data;

      // New async endpoint returns execution_id, task_id, status, message
      const execution = {
        execution_id: result.execution_id,
        task_id: result.task_id,
        status: result.status || 'queued',
        message: result.message || 'Workflow execution queued successfully',
        progress: 0,
        records_processed: 0
      };

      setCurrentExecution(execution);
      setTaskId(result.task_id);
      setExecuteDialog(false);
      setTabValue(1);

      // Don't set executing to false - let polling handle it
      // Show success message
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to start workflow execution');
      setExecuting(false);
    }
  };

  const handleDeleteWorkflow = async () => {
    if (window.confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) {
      try {
        await workflowsAPI.delete(workflowId);
        navigate('/workflows');
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
      case 'queued':
        return (
          <Chip
            icon={<ScheduleIcon />}
            label="Queued"
            color="info"
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

  const getConnectionName = (connectionId) => {
    const connection = connections.find(c => c.id === connectionId);
    return connection ? `${connection.name} (${connection.server}/${connection.database})` : 'Unknown';
  };

  const renderWorkflowOverview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Workflow Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Name</Typography>
                <Typography variant="body1">{workflow.name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Description</Typography>
                <Typography variant="body1">{workflow.description || 'No description provided'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Connection</Typography>
                <Typography variant="body2">{getConnectionName(workflow.connection_id)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Created</Typography>
                <Typography variant="body2">{new Date(workflow.created_at).toLocaleString()}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {workflow.table_mappings && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Table Mappings ({workflow.table_mappings?.length || 0})
              </Typography>
              {workflow.table_mappings?.map((mapping, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box display="flex" alignItems="center" width="100%">
                      <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                        {mapping.source_table} → {mapping.destination_table}
                      </Typography>
                      <Chip
                        label={`${mapping.column_mappings?.filter(col => col.is_pii).length || 0} PII columns`}
                        size="small"
                        color="primary"
                        sx={{ mr: 2 }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Source Column</TableCell>
                            <TableCell>Destination Column</TableCell>
                            <TableCell>PII</TableCell>
                            <TableCell>PII Attribute</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {mapping.column_mappings?.map((col, colIndex) => (
                            <TableRow key={colIndex}>
                              <TableCell>{col.source_column}</TableCell>
                              <TableCell>{col.destination_column}</TableCell>
                              <TableCell>
                                {col.is_pii ? (
                                  <Chip label="Yes" color="warning" size="small" />
                                ) : (
                                  <Chip label="No" variant="outlined" size="small" />
                                )}
                              </TableCell>
                              <TableCell>
                                {col.pii_attribute || '-'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        )}
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Status & Actions
            </Typography>
            <Box mb={2}>
              {getStatusChip(workflow.status)}
            </Box>

            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={() => setExecuteDialog(true)}
                disabled={workflow.status === 'running' || executing}
                fullWidth
              >
                Execute Workflow
              </Button>

              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/workflows/${workflowId}/edit`)}
                fullWidth
              >
                Edit Workflow
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteWorkflow}
                fullWidth
              >
                Delete Workflow
              </Button>
            </Box>

            {currentExecution && currentExecution.status === 'running' && (
              <Box mt={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Current Execution
                </Typography>
                <LinearProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Status: {currentExecution.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Records: {currentExecution.records_processed || 0}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderExecutionHistory = () => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Execution History ({executions.length})
          </Typography>
          <IconButton onClick={loadWorkflowData}>
            <RefreshIcon />
          </IconButton>
        </Box>

        {executions.length === 0 ? (
          <Typography color="text.secondary">
            No executions yet. Click "Execute Workflow" to run this workflow.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Execution ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Started</TableCell>
                  <TableCell>Completed</TableCell>
                  <TableCell>Records</TableCell>
                  <TableCell>Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {executions.map((execution) => {
                  const duration = execution.completed_at
                    ? Math.round((new Date(execution.completed_at) - new Date(execution.started_at)) / 1000)
                    : null;

                  return (
                    <TableRow key={execution.id}>
                      <TableCell>
                        <Typography variant="body2" component="code" sx={{
                          backgroundColor: '#f5f5f5',
                          padding: '2px 6px',
                          borderRadius: 1
                        }}>
                          {execution.id}
                        </Typography>
                      </TableCell>
                      <TableCell>{getStatusChip(execution.status)}</TableCell>
                      <TableCell>{new Date(execution.started_at).toLocaleString()}</TableCell>
                      <TableCell>
                        {execution.completed_at ? new Date(execution.completed_at).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>{execution.records_processed || 0}</TableCell>
                      <TableCell>{duration ? `${duration}s` : '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  const workflowDetailContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }

    if (!workflow) {
      return (
        <Box>
          <Alert severity="error">
            Workflow not found
          </Alert>
        </Box>
      );
    }

    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/workflows')}
            sx={{ mr: 2 }}
          >
            Back to Workflows
          </Button>
          <Box flexGrow={1}>
            <Typography variant="h4" gutterBottom>
              {workflow.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Workflow Details & Execution History
            </Typography>
          </Box>
          {getStatusChip(workflow.status)}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Overview" />
            <Tab label="Execution History" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderWorkflowOverview()}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {renderExecutionHistory()}
        </TabPanel>

        <Dialog open={executeDialog} onClose={() => setExecuteDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Execute Workflow</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Are you sure you want to execute this workflow?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This will start the PII masking and data copy process from the source to destination database.
              The process may take some time depending on the amount of data.
            </Typography>

            <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
              <Typography variant="subtitle2">Workflow Summary:</Typography>
              <Typography variant="body2">• {workflow.table_mappings?.length || 0} table(s) to process</Typography>
              <Typography variant="body2">
                • {workflow.table_mappings?.reduce((total, mapping) =>
                  total + (mapping.column_mappings?.filter(col => col.is_pii).length || 0), 0
                )} PII column(s) to mask
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExecuteDialog(false)}>Cancel</Button>
            <Button
              onClick={handleExecuteWorkflow}
              variant="contained"
              disabled={executing}
            >
              {executing && <CircularProgress size={20} sx={{ mr: 1 }} />}
              Execute
            </Button>
          </DialogActions>
        </Dialog>
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
            {workflowDetailContent()}
          </Box>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default WorkflowDetailPage;