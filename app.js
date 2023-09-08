import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import connectDB from './db/index.js';

const app = express();
const PORT = process.env.PORT || 7777;

// Middleware
app.use(express.json());
app.use(cors());  // Add CORS support (Optional, based on your needs)

// Database connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);


// Default error handler
app.use((err, req, res, next) => {
  console.error(err);  // Log error for debugging
  res.status(err.status || 500).send({ error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;