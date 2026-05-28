require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const analyticsRoutes = require('./routes/analyticsRoutes');
const exportRoutes = require('./routes/exportRoutes');
const healthRoutes = require('./routes/healthRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/health', healthRoutes);

// 404 Handler - Undefined Routes
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.path}`);
  error.statusCode = 404;
  next(error);
});

// Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
