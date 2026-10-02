const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const healthRoutes = require('./routes/health');
const documentRoutes = require('./routes/documents');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/documents', documentRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.warn(
      'MongoDB not available — running without database connection.'
    );
    console.warn(`Connection error: ${error.message}`);
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 RAG Intelligence Platform API`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Server:      http://localhost:${PORT}`);
    console.log(`   Health:      http://localhost:${PORT}/api/health\n`);
  });
};

startServer();
