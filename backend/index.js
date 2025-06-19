const express = require('express');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
app.use(express.json());

// Public routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/notes', noteRoutes);

app.listen(3000, () => console.log('Server running'));