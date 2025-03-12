// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import clickRoutes from './routes/clickRoutes.js';
import connectDB from './db/index.js';

const PORT = process.env.PORT || 7777;
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'https://placify-admin-frontend.vercel.app'],
  credentials: true,
}));
app.use(helmet());
app.use(limiter);
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/clicks', clickRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).send({ error: err.message || 'An unexpected error occurred' });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
