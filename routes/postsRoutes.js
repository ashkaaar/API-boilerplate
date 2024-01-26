const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getLatestNPosts,
  searchPosts,
  getPopularPosts,
  getRecommendedPosts,
} = require('../controller/postsController');
const { cache } = require('../middleware/cacheMiddleware'); // Import the cache middleware

router.get('/', cache, getPosts); // Use the cache middleware only here
router.get('/latest/:n', getLatestNPosts);
router.get('/search/:keyword', searchPosts);
router.get('/popular', getPopularPosts);
router.get('/recommended/:id', getRecommendedPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;