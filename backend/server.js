const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Initialize Express
const app = express();

// ======================
// 1. Security Middleware
// ======================
app.use(helmet()); // Protects against common vulnerabilities
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:19006', // Match your Expo app
  credentials: true
}));

// Rate limiting (100 requests per 15min)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// ======================
// 2. Body Parsing
// ======================
app.use(express.json({ limit: '10kb' })); // Prevent large payloads

// ======================
// 3. Database Connection
// ======================
const { sequelize } = require('./config/db');

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('Connection error:', err));

// ======================
// 4. Routes
// ======================
const notesRouter = require('./routes/noteRoutes');
const authRouter = require('./routes/authRoutes'); // Assuming you have auth

app.use('/api/notes', notesRouter); // Mount points
app.use('/api/auth', authRouter);

// ======================
// 5. Error Handling
// ======================
// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ======================
// 6. Server Startup
// ======================
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});