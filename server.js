const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Create a new Redis client
const client = redis.createClient();

(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err) => console.log('Redis Client Connection Error', err));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const postRoutes = require('./routes/posts');
app.use('/posts', postRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});