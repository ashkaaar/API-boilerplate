const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    // schema here
});

module.exports = mongoose.model('Post', PostSchema);