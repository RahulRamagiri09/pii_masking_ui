# DataMaskerX

A React.js frontend application for managing PII masking workflows with database teams. This application allows you to create secure data copy operations from production to non-production environments with automated PII masking using Faker-like libraries.

## Features

- **Database Connection Management**: Connect to Azure SQL databases with secure credential storage
- **Workflow Creation**: Set up data masking and copy workflows with step-by-step wizard
- **PII Column Mapping**: Map database columns to 34+ predefined PII attributes for automatic masking
- **Workflow Execution**: Execute workflows with real-time progress tracking
- **Execution History**: View detailed execution logs and history
- **Sample Data Preview**: Preview masked data samples before execution

## Prerequisites

- Node.js 16+ and npm
- Backend API running (Quart Python backend with Azure services)
- Azure SQL Database connections configured

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env file in the frontend directory
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

3. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Backend Integration

This frontend connects to a Quart Python backend that provides:
- Azure Cosmos DB for metadata storage
- Azure Key Vault for secure credential storage
- Faker library integration for PII masking
- RESTful API endpoints for all operations

Make sure the backend is running on http://localhost:8000 before starting the frontend.

## Usage

1. **Add Database Connections**: Go to Connections page and add your source and destination database connections
2. **Create Workflows**: Use the Create Workflow wizard to set up table mappings and PII column configurations
3. **Execute Workflows**: Run workflows to mask and copy data between databases
4. **Monitor Progress**: Track execution status and view detailed logs

## Available PII Attributes

The application supports 34+ PII attributes including:
- Names (first_name, last_name, name)
- Contact info (email, phone_number)
- Addresses (address, city, state, zipcode)
- Government IDs (ssn, passport_number)
- Business info (company, job)
- And many more...

## Development

### Project Structure
```
src/
├── components/
│   ├── Connections/         # Database connection management
│   ├── Dashboard/           # Main dashboard
│   ├── Layout/             # Navigation and layout
│   └── Workflows/          # Workflow management
├── services/
│   └── api.js             # API service layer
└── App.js                 # Main application component
```

### Build for Production
```bash
npm run build
```

## Security

- Database passwords are securely stored in Azure Key Vault
- All API communications use HTTPS in production
- Managed Identity authentication for Azure services
- No sensitive data stored in frontend application

## License

This project is licensed under the MIT License.
