const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    userProfile: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
});

// UserSchema.virtual('jwtId').get(function () {
//     return this._id.toHexString();
// });

// UserSchema.set('toJSON', {
//     virtuals: true,
// });

module.exports = mongoose.model('User', UserSchema);
