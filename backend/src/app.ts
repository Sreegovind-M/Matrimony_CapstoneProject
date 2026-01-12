import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';
import userRoutes from './routes/user.routes';
import { testConnection } from './config/db.config';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true,  // Allow all origins for development (mobile access)
  credentials: true
}));
app.use(express.json());

// API Routes with /api prefix
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve Angular static files in production
const frontendPath = path.join(__dirname, '../../frontend/dist/frontend/browser');
app.use(express.static(frontendPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  // Test database connection
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.warn('⚠️ Server starting without database connection. Some features may not work.');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🌐 Frontend served at http://localhost:${PORT}`);
  });
};

startServer();
