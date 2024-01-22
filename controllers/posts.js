const redis = require('redis');
const redisClient = redis.createClient();

const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
});

exports.createPost = async (req, res) => {
    const { title, content, userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const post = new Post({
            title,
            content,
            author: user._id,
        });

        await post.save();

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('author');
        res.send(posts);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getPost = async (req, res) => {
    const id = req.params.id;

    // Try getting the post from Redis first
    redisClient.get(id, async (err, data) => {
        if (err) throw err;

        if (data !== null) {
            // If the post is in Redis, return it
            res.send(JSON.parse(data));
        } else {
            // If the post is not in Redis, get it from the database
            try {
                const post = await Post.findById(id).populate('author').populate('comments');
                if (!post) {
                    return res.status(404).send();
                }
                // Then save it in Redis for next time
                redisClient.setex(id, 3600, JSON.stringify(post)); // Cache it for 1 hour
                res.send(post);
            } catch (err) {
                res.status(500).send(err);
            }
        }
    });
};

exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!post) {
            return res.status(404).send();
        }
        res.send(post);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).send();
        }
        res.send(post);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getLatestPosts = (req, res, next) => {
    const n = parseInt(req.params.n);
    Post.find().sort({ createdAt: -1 }).limit(n)
        .then(posts => res.json(posts))
        .catch(err => next(err));
};

exports.searchPosts = (req, res, next) => {
    const term = req.params.term;
    Post.find({ $text: { $search: term } })
        .then(posts => res.json(posts))
        .catch(err => next(err));
};

exports.getPopularPosts = (req, res, next) => {
    Post.find().sort({ views: -1 }).limit(10)
        .then(posts => res.json(posts))
        .catch(err => next(err));
};