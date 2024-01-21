const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Add this line
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const postRoutes = require('./routes/posts');
app.use('/posts', postRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});