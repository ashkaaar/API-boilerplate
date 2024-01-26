const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const setupMiddleware = require('./middleware/setupMiddleware'); // New
const port = process.env.PORT || 5001;

connectDB();

const app = express();

setupMiddleware(app); // New

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/posts', require('./routes/postsRoutes')); // Updated

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

app.listen(port, () => console.log(`Server started on port ${port}`));