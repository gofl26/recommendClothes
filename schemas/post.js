const mongoose = require('mongoose');

const postsSchema = mongoose.Schema({
    postId: {
        type: Number,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    // like: {
    //     type: Number,
    // },
});

module.exports = mongoose.model('Posts', postsSchema);