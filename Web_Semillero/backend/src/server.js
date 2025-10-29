/* Basic Express server */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

dotenv.config();

const app = express();

// Basic config
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(morgan(process.env.LOG_FORMAT || 'dev'));

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'backend',
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

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
