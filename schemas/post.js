const mongoose = require('mongoose');

const postsSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
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
    // image: {
    //     type: String,
    //     required: true,
    // },
    // like: {
    //     type: Number,
    // },
});

postsSchema.virtual('postId').get(function () {
    return this._id.toHexString();
});

postsSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Posts', postsSchema);
