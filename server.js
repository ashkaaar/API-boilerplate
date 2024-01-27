// server.js
const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const setupMiddleware = require('./middleware/setupMiddleware');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');

const port = process.env.PORT || 5001;

connectDB();

const app = express();

// Use Helmet to protect against well known vulnerabilities
app.use(helmet());


// Use express-validator to validate requests
app.use('/api/posts', [
  check('title').isLength({ min: 5 }),
  check('content').isLength({ min: 20 }),
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, require('./routes/postsRoutes'));

setupMiddleware(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

// Export the app instance for testing
module.exports = app;