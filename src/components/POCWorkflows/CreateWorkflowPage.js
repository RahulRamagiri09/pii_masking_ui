import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid';
import Grid from '@mui/material/Grid'
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { connectionsAPI, workflowsAPI, maskingAPI } from '../../services/api';
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

const CreateWorkflowPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connections, setConnections] = useState([]);
  const [piiAttributes, setPiiAttributes] = useState([]);
  const [previewDialog, setPreviewDialog] = useState({ open: false, attribute: '', samples: [] });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    source_connection_id: '',
    destination_connection_id: '',
    table_mappings: []
  });

  const [currentTableMapping, setCurrentTableMapping] = useState({
    source_table: '',
    destination_table: '',
    column_mappings: []
  });

  const [sourceTables, setSourceTables] = useState([]);
  const [destinationTables, setDestinationTables] = useState([]);
  const [sourceColumns, setSourceColumns] = useState([]);

  const steps = ['Basic Info', 'Select Tables', 'Configure Mapping', 'Review & Create'];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [connectionsRes, piiRes] = await Promise.all([
        connectionsAPI.getAll(),
        workflowsAPI.getPiiAttributes()
      ]);

      // Handle different response structures safely
      const connectionsData = connectionsRes.data?.data || connectionsRes.data || [];
      const piiData = piiRes.data?.data || piiRes.data || [];

      setConnections(Array.isArray(connectionsData) ? connectionsData : []);
      setPiiAttributes(Array.isArray(piiData) ? piiData : []);
    } catch (err) {
      setError(err.message);
      setConnections([]);
      setPiiAttributes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(null);
  };

  const handleNext = async () => {
    try {
      if (activeStep === 0) {
        // Validate basic info
        if (!formData.name || !formData.source_connection_id || !formData.destination_connection_id) {
          setError('Please fill in all required fields');
          return;
        }
        if (formData.source_connection_id === formData.destination_connection_id) {
          setError('Source and destination connections must be different');
          return;
        }
        await Promise.all([loadSourceTables(), loadDestinationTables()]);
      } else if (activeStep === 1) {
        // Validate table selection
        if (!currentTableMapping.source_table || !currentTableMapping.destination_table) {
          setError('Please select both source and destination tables');
          return;
        }
        await loadSourceColumns();
      } else if (activeStep === 2) {
        // Validate column mappings
        if (currentTableMapping.column_mappings.length === 0) {
          setError('Please configure at least one column mapping');
          return;
        }
        // Add current table mapping to the list
        setFormData(prev => ({
          ...prev,
          table_mappings: [...prev.table_mappings, currentTableMapping]
        }));
      }

      setActiveStep(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError(null);
  };

  const loadSourceTables = async () => {
    try {
      setLoading(true);
      const response = await connectionsAPI.getSourceTables(formData.source_connection_id);

      // Handle different response structures safely
      const data = response.data?.data || response.data || [];
      setSourceTables(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setSourceTables([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDestinationTables = async () => {
    try {
      setLoading(true);
      const response = await connectionsAPI.getDestinationTables(formData.destination_connection_id);

      // Handle different response structures safely
      const data = response.data?.data || response.data || [];
      setDestinationTables(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setDestinationTables([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSourceColumns = async () => {
    try {
      setLoading(true);
      const response = await connectionsAPI.getSourceTableColumns(
        formData.source_connection_id,
        currentTableMapping.source_table
      );

      // Handle different response structures safely
      const data = response.data?.data || response.data || [];
      setSourceColumns(Array.isArray(data) ? data : []);

      // Initialize column mappings
      const columnMappings = data.map(col => ({
        source_column: col.name,
        destination_column: col.name,
        is_pii: false,
        pii_attribute: ''
      }));

      setCurrentTableMapping(prev => ({
        ...prev,
        column_mappings: columnMappings
      }));
    } catch (err) {
      setError(err.message);
      setSourceColumns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleColumnMappingChange = (index, field, value) => {
    setCurrentTableMapping(prev => ({
      ...prev,
      column_mappings: prev.column_mappings.map((mapping, i) =>
        i === index ? { ...mapping, [field]: value } : mapping
      )
    }));
  };

  const handlePreviewSample = async (attribute) => {
    try {
      const response = await maskingAPI.generateSampleData(attribute, 5);

      // Handle different response structures safely
      const samples = response.data?.data?.samples || response.data?.samples || [];
      setPreviewDialog({
        open: true,
        attribute,
        samples: Array.isArray(samples) ? samples : []
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateWorkflow = async () => {
    try {
      setLoading(true);
      await workflowsAPI.create(formData);
      navigate('/workflows');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Workflow Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                multiline
                rows={3}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Source Connection</InputLabel>
                <Select
                  value={formData.source_connection_id}
                  onChange={handleInputChange('source_connection_id')}
                  label="Source Connection"
                >
                  {connections.map((conn) => (
                    <MenuItem key={conn.id} value={conn.id}>
                      {conn.name} ({conn.server}/{conn.database})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Destination Connection</InputLabel>
                <Select
                  value={formData.destination_connection_id}
                  onChange={handleInputChange('destination_connection_id')}
                  label="Destination Connection"
                >
                  {connections.map((conn) => (
                    <MenuItem key={conn.id} value={conn.id}>
                      {conn.name} ({conn.server}/{conn.database})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Source Table</InputLabel>
                <Select
                  value={currentTableMapping.source_table}
                  onChange={(e) => setCurrentTableMapping(prev => ({ ...prev, source_table: e.target.value }))}
                  label="Source Table"
                >
                  {sourceTables.map((table) => (
                    <MenuItem key={table} value={table}>
                      {table}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Destination Table</InputLabel>
                <Select
                  value={currentTableMapping.destination_table}
                  onChange={(e) => setCurrentTableMapping(prev => ({ ...prev, destination_table: e.target.value }))}
                  label="Destination Table"
                >
                  {destinationTables.map((table) => (
                    <MenuItem key={table} value={table}>
                      {table}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary">
                Select the source table to copy data from and select the destination table.
              </Typography>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configure Column Mappings for {currentTableMapping.source_table}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Source Column</TableCell>
                    <TableCell>Destination Column</TableCell>
                    <TableCell>Data Type</TableCell>
                    <TableCell>Is PII</TableCell>
                    <TableCell>PII Attribute</TableCell>
                    <TableCell>Preview</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentTableMapping.column_mappings.map((mapping, index) => {
                    const columnInfo = sourceColumns.find(col => col.name === mapping.source_column);
                    return (
                      <TableRow key={index}>
                        <TableCell>{mapping.source_column}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={mapping.destination_column}
                            onChange={(e) => handleColumnMappingChange(index, 'destination_column', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={columnInfo?.data_type || 'Unknown'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            checked={mapping.is_pii}
                            onChange={(e) => handleColumnMappingChange(index, 'is_pii', e.target.checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 150 }} disabled={!mapping.is_pii}>
                            <Select
                              value={mapping.pii_attribute}
                              onChange={(e) => handleColumnMappingChange(index, 'pii_attribute', e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value="">Select attribute</MenuItem>
                              {piiAttributes.map((attr) => (
                                <MenuItem key={attr} value={attr}>
                                  {attr.replace('_', ' ')}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          {mapping.is_pii && mapping.pii_attribute && (
                            <IconButton
                              size="small"
                              onClick={() => handlePreviewSample(mapping.pii_attribute)}
                            >
                              <PreviewIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Workflow Configuration
            </Typography>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="subtitle1">Basic Information</Typography>
                <Typography variant="body2">Name: {formData.name}</Typography>
                <Typography variant="body2">Description: {formData.description || 'No description'}</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle1">Connections</Typography>
                <Typography variant="body2">
                  Source: {connections.find(c => c.id === formData.source_connection_id)?.name}
                </Typography>
                <Typography variant="body2">
                  Destination: {connections.find(c => c.id === formData.destination_connection_id)?.name}
                </Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle1">Table Mappings</Typography>
                {formData.table_mappings.map((mapping, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="body2">
                      {mapping.source_table} → {mapping.destination_table}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {mapping.column_mappings.filter(col => col.is_pii).length} PII columns configured
                    </Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  const createWorkflowContent = () => {
    if (loading && activeStep === 0) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={() => navigate('/workflows')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" gutterBottom>
              Create New Workflow
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Set up a new PII masking and data copy workflow
            </Typography>
          </Box>
        </Box>

        <Card>
          <CardContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {renderStepContent()}

            <Box display="flex" justifyContent="space-between" mt={4}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
              >
                Back
              </Button>

              <Button
                onClick={activeStep === steps.length - 1 ? handleCreateWorkflow : handleNext}
                variant="contained"
                disabled={loading}
              >
                {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                {activeStep === steps.length - 1 ? 'Create Workflow' : 'Next'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Sample Data Preview Dialog */}
        <Dialog
          open={previewDialog.open}
          onClose={() => setPreviewDialog({ open: false, attribute: '', samples: [] })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Sample Data Preview: {previewDialog.attribute?.replace('_', ' ')}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Here are some sample values that will be generated for this PII attribute:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {previewDialog.samples.map((sample, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2" component="code" sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '2px 6px',
                    borderRadius: 1
                  }}>
                    {sample}
                  </Typography>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialog({ open: false, attribute: '', samples: [] })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="h-screen flex flex-col bg-gray-50">
        <Navbar user={user} />
        <div className="flex-1 overflow-auto">
          <Box sx={{ maxWidth: '1440px', width: '100%', mx: 'auto', mt: 3, mb: 3, px: 3 }}>
            {createWorkflowContent()}
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default CreateWorkflowPage;