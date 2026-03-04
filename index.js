require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/database');
const { createUsersTable } = require('./src/model/User');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const initializeDatabase = async () => {
  await connectDB();
  await createUsersTable();
};

initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Multi Database CRUD Explorer - MySQL',
    endpoints: {
      users: {
        'GET /api/users': 'Get all users',
        'GET /api/users/:id': 'Get user by ID',
        'POST /api/users': 'Create a new user',
        'PUT /api/users/:id': 'Update user by ID',
        'DELETE /api/users/:id': 'Delete user by ID',
      },
    },
  });
});

app.use('/api/users', userRoutes);

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
