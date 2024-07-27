// Importing modules
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import clickRoutes from './routes/clickRoutes.js';
import connectDB from './db/index.js';

// Configuration constants
const PORT = process.env.PORT || 7777;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // Max 100 requests per window per IP

// Configure rate limiter for better security against brute force attacks
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS
});

// Initialize Express app
const app = express();

// Apply middlewares
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enables CORS with default settings
app.use(helmet()); // Helps secure Express apps by setting various HTTP headers
app.use(limiter); // Apply the rate limiter to all requests

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/clicks', clickRoutes);

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).send({ error: err.message || 'An unexpected error occurred' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;