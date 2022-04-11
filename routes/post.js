const express = require('express');
const Posts = require('../schemas/post');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('this is root page');
});

//포스트 목록 불러오기(코디추천 버튼 누르면 실행)
router.get('/postGet', async (req, res) => {
    // const { user } = res.locals;
    // res.send({
    //     user,
    // });

    const posts = await Posts.find();
    res.json({
        posts: posts,
    });
});

//글 등록하기API
router.post('/postWrite', async (req, res) => {
    const today = new Date();
    const date = today.toLocaleString();
    const { userName, title, content, userId } = req.body;
    
    const createdPost = await Posts.create({
        userId,
        content,
        title,
        userName,
        date,
    });
    res.json({ post: createdPost });
});

//글 수정하기API
router.put('/detail/:id', async (req, res) => {
    const { id } = req.params;
    const { content, title } = req.body;
    const today = new Date();
    const date = today.toLocaleString();

    const createdPost = await Posts.updateOne(
        { postId: id },
        { $set: { content, title, date } }
    );

    res.json({ post: createdPost });
});

//글 상세조회API
router.get('/detail/:id', async (req, res) => {
    const { id } = req.params;
    const o_id = new Object(id)
    const [detail] = await Posts.find({ _id : o_id });
    
    res.json({
        detail,
    });
});

//글 삭제하기API
router.delete('/detail/:id', async (req, res) => {
    const { id } = req.params;
    const o_id = new Object(id)
    const existsPosts = await Posts.find({ _id : o_id });
    if (existsPosts.length) {
        await Posts.deleteOne({ _id : o_id });
    }
    const existsComments = await Comments.find({ postId: o_id });
    if (existsComments.length) {
        await Comments.deleteMany({ postId: o_id });
    }

    res.json({ success: true });
});

module.exports = router;