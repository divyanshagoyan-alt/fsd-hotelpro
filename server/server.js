import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB, getDBStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import operationsRoutes from './routes/operationsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

process.on('uncaughtException', (err) => {
  console.error('[Process Uncaught Exception]:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Process Unhandled Rejection]:', reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck & Database Diagnostic endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'online',
    system: 'HotelPro MERN Backend',
    database: {
      provider: 'MongoDB',
      connected: dbStatus.connected,
      uri: dbStatus.uri,
      readyState: dbStatus.readyState,
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[HotelPro Server Error]', err.stack || err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🏨 HotelPro Backend API Server Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🍃 Database: MongoDB (${process.env.MONGODB_URI || 'mongodb://localhost:27017/hotelpro'})`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

// Attempt MongoDB Connection
connectDB().catch(err => {
  console.warn('[MongoDB] Background connection attempt failed:', err.message);
});

export default app;
