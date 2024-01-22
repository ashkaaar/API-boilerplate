const express = require('express');
const postsController = require('../controllers/posts');
const router = express.Router();

router.post('/', postsController.createPost);
router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPost);
router.put('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);
router.get('/latest/:n', postsController.getLatestPosts);
router.get('/search/:term', postsController.searchPosts);
router.get('/popular', postsController.getPopularPosts);

module.exports = router;