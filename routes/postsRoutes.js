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
  getRecommendedPosts, // New function
} = require('../controller/postsController');

router.get('/', getPosts);
router.get('/latest/:n', getLatestNPosts);
router.get('/search/:keyword', searchPosts);
router.get('/popular', getPopularPosts);
router.get('/recommended/:id', getRecommendedPosts); // New route
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;