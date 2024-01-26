// server.js
const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const setupMiddleware = require('./middleware/setupMiddleware');
const port = process.env.PORT || 5001;

connectDB();

const app = express();

setupMiddleware(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/posts', require('./routes/postsRoutes'));

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