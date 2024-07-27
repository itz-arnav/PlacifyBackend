import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import clickRoutes from './routes/clickRoutes.js';

import connectDB from './db/index.js';

const app = express();
const PORT = process.env.PORT || 7777;

app.use(express.json());
app.use(cors(

));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/clicks', clickRoutes);

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(err.status || 500).send({ error: err.message });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;