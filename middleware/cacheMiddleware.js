const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

// Event listener for successful connection
client.on('connect', function() {
    console.log('Redis client connected');
});

// Event listener for error on connection
client.on('error', (err) => {
    console.error("Error connecting to redis", err);
});

// Cache middleware
const cache = (req, res, next) => {
    const key = 'allPosts'; // Use a fixed key for caching getPosts result

    client.get(key, (err, data) => {
        if (err) throw err;

        if (data !== null) {
            res.send(JSON.parse(data));
        } else {
            next();
        }
    });
};

module.exports = {
    cache
};