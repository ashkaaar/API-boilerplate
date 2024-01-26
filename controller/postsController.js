const asyncHandler = require('express-async-handler');
const Post = require('../models/postModel');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  // Try fetching the data from Redis first
  client.get('allPosts', async (err, posts) => {
    if (posts) {
      // If the data is in the cache, send it
      res.json(JSON.parse(posts));
    } else {
      // If the data is not in the cache, fetch it from the database
      posts = await Post.find({});
      if (posts) {
        // Store the data in the Redis cache
        client.setex('allPosts', 3600, JSON.stringify(posts));
        res.json(posts);
      } else {
        res.status(404);
        throw new Error('Posts not found');
      }
    }
  });
});

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const post = new Post({
    ...req.body,
    // user: req.user._id, // <-- Remove this line
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    post.title = title;
    post.content = content;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    await post.remove();
    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (post) {
    res.json(post)
  } else {
    res.status(404)
    throw new Error('Post not found')
  }
})

// @desc    Get latest N posts
// @route   GET /api/posts/latest/:n
// @access  Public
const getLatestNPosts = asyncHandler(async (req, res) => {
  const n = parseInt(req.params.n);
  const posts = await Post.find().sort({ createdAt: -1 }).limit(n);
  if (posts) {
    res.json(posts)
  } else {
    res.status(404)
    throw new Error('No posts found')
  }
})

// @desc    Search posts
// @route   GET /api/posts/search/:keyword
// @access  Public
const searchPosts = asyncHandler(async (req, res) => {
  const keyword = req.params.keyword;
  const posts = await Post.find({
    $or: [
      { title: { $regex: keyword, $options: 'i' } },
      { content: { $regex: keyword, $options: 'i' } },
    ],
  });
  if (posts.length > 0) {
    res.json(posts);
  } else {
    res.status(404);
    throw new Error('No posts found');
  }
});

// @desc    Get popular posts
// @route   GET /api/posts/popular
// @access  Public
const getPopularPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().sort({ views: -1 }).limit(5);
  if (posts.length > 0) {
    res.json(posts);
  } else {
    res.status(404);
    throw new Error('No posts found');
  }
});

// @desc    Get recommended posts
// @route   GET /api/posts/recommended/:id
// @access  Public
const getRecommendedPosts = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Find posts with a similar title
  const keyword = post.title;
  const posts = await Post.find({
    $and: [
      { _id: { $ne: post._id } }, // Exclude the current post
      { title: { $regex: keyword, $options: 'i' } }, // Case-insensitive search
    ],
  }).limit(5); // Limit to 5 recommended posts

  if (posts.length > 0) {
    res.json(posts);
  } else {
    res.status(404);
    throw new Error('No recommended posts found');
  }
});

module.exports = {
  getPosts,
  getPostById,
  getLatestNPosts,
  searchPosts,
  getPopularPosts,
  getRecommendedPosts,
  createPost, 
  updatePost, 
  deletePost, 
};