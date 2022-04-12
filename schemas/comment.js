const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
    postId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    // commentId: {
    //     type: Number,
    //     required: true,
    //     unique: true,
    // },
    userName: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    // like: {
    //     type: Number,
    // },
});

commentsSchema.virtual('commentId').get(function () {
    return this._id.toHexString();
});

commentsSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Comments', commentsSchema);
