/* Basic Express server */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Basic config
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(process.env.LOG_FORMAT || 'dev'));

// Import routes
const authRouter = require('./routes/auth');
const lessonsRouter = require('./routes/lessons');
const practicesRouter = require('./routes/practices');
const progressRouter = require('./routes/progress');
const adminRouter = require('./routes/admin');

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'backend',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Auth API routes
app.use('/api/auth', authRouter);

// Lessons API routes
app.use('/api/lessons', lessonsRouter);

// Practices API routes
app.use('/api/practices', practicesRouter);

// Progress API routes
app.use('/api/progress', progressRouter);

// Admin API routes
app.use('/api/admin', adminRouter);

// 404 handler for API
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;

function start() {
  app.listen(PORT, () => {
    console.log(`[backend] Listening on port ${PORT}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
