const express = require('express');
const Posts = require('../schemas/post');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth-middleware');


router.get('/', (req, res) => {
    res.send('this is root page');
});

//포스트 목록 불러오기(코디추천 버튼 누르면 실행), 로그인해야 사용가능
router.get('/postGet',  authMiddleware, async (req, res) => {
    const { user } = res.locals;
    res.send({
        user,
    });

    const posts = await Posts.find();
    res.json({
        posts: posts,
    });
});

module.exports = router;