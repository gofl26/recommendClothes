const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const fs = require("fs");
const mykey = fs.readFileSync(__dirname + "/key.txt").toString();

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = (authorization || '').split(' ');

    if (tokenType !== 'Bearer') {
        res.status(401).send({
            errorMEssage: '로그인 후 사용하세요',
        });
        return;
    }

    //jwt검증//
    try {
        const { userId } = jwt.verify(tokenValue, mykey);
        //검증 성공시 locals에 인증 정보 넣어주기//
        User.findById(userId).exec().then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (error) {
        res.status(401).send({
            errorMEssage: '로그인 후 사용하세요',
        });
        return;
    }
};