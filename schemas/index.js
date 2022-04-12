const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => {
    mongoose
        .connect('mongodb://52.78.194.238:27017/recommendClothes', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .catch((err) => {
            console.error(err);
        });
};

module.exports = connect;
