const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event_management_exp6';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('====================================');
    console.log('MongoDB Connected Successfully to:', MONGO_URI);
    console.log('====================================');
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message);
  });

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    project: 'Event Management System with JWT Authentication & RBAC',
    experiment: 'Experiment 6 - FSD Lab',
    status: 'Running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (Protected)'
      },
      events: {
        list: 'GET /api/events',
        create: 'POST /api/events (Protected)',
        delete: 'DELETE /api/events/:id (Protected / Admin)'
      },
      admin: {
        dashboard: 'GET /api/admin/dashboard (Admin Only)',
        users: 'GET /api/admin/users (Admin Only)'
      }
    }
  });
});

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Base URL: http://localhost:${PORT}`);
});

module.exports = app;

