const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDynamoDB, testConnection } = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Multi-Database CRUD Explorer - DynamoDB Edition',
    status: 'Server is running',
    database: 'AWS DynamoDB',
    endpoints: {
      users: '/api/users',
      health: '/health',
    },
    documentation: 'See README.md for API documentation',
  });
});

// Health check route
app.get('/health', async (req, res) => {
  const isConnected = await testConnection();
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'healthy' : 'unhealthy',
    database: 'AWS DynamoDB',
    timestamp: new Date().toISOString(),
  });
});

// User routes
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Initialize DynamoDB and start server
const startServer = async () => {
  try {
    // Initialize DynamoDB
    console.log('Initializing DynamoDB...');
    initializeDynamoDB();

    // Test connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.warn('Warning: DynamoDB connection test failed, but server will continue running');
      console.warn('Make sure to create the table before making requests');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`\nServer started successfully`);
      console.log(`Running on: http://localhost:${PORT}`);
      console.log(`Database: AWS DynamoDB`);
      console.log(`Table: ${process.env.DYNAMODB_TABLE_NAME}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\nAPI Endpoints:`);
      console.log(`   GET    /                - Welcome message`);
      console.log(`   GET    /health          - Health check`);
      console.log(`   POST   /api/users       - Create user`);
      console.log(`   GET    /api/users       - Get all users`);
      console.log(`   GET    /api/users/:id   - Get user by ID`);
      console.log(`   PUT    /api/users/:id   - Update user`);
      console.log(`   DELETE /api/users/:id   - Delete user`);
      console.log(`\nReady to accept requests!\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
