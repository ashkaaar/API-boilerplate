const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
    },
    content: {
        type: String,
        required: [true, 'Please add content'],
    },
    views: {
        type: Number,
        default: 0,
    },
    // Add any other fields you need
});

module.exports = mongoose.model('Post', postSchema);