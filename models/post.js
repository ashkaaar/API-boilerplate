const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    views: { type: Number, default: 0 },
});

module.exports = mongoose.model('Post', PostSchema);