const Post = require('../models/post');

exports.createPost = async (req, res) => {
    const post = new Post(req.body);
    try {
        await post.save();
        res.status(201).send(post);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.send(posts);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send();
        }
        res.send(post);
    } catch (err) {
        res.status(500).send(err);
    }
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