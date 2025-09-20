import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helemt from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger, expressLogger } from './utils/logger.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

connectDB();

app.use(express.json());
app.use(helemt());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// logging middleware
app.use(expressLogger);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
