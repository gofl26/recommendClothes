const express = require('express');
const Comments = require('../schemas/comment');
const Posts = require('../schemas/post');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth-middleware');
const { collection } = require('../schemas/comment');
const upload = require('../S3/s3');

router.get('/', (req, res) => {
    res.send('this is root page');
});

// 코멘트등록
router.post(
    '/comment/:id',
    authMiddleware,
    upload.single('image'),
    async (req, res) => {
        const { id } = req.params;

        let today = new Date();
        let date = today.toLocaleString();

        const { user } = res.locals;
        console.log(user);
        let userId = user.userId;
        let userProfile = user.userProfile;
        // const exist = await Comments.findById('62555dc700c7e8afe8dc14b7');
        // console.log(exist);

        let userName = user.userName;

        const { comment } = req.body;
        const image = req.file?.location; // 파일 없을때,
        // const image = req.file.location;

        try {
            await Comments.create({
                postId: id,
                userId,
                userName,
                comment,
                // commentId,
                date,
                userProfile,
                image,
            });
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(400);
            // next(err);
        }

        // const createdComment = await Comments.create({
        //     postId: id,
        //     userId,
        //     userName,
        //     comment,
        //     // commentId,
        //     // image,
        //     date,
        // });

        // res.json({
        //     msg: '댓글 등록 완료!!',
        // });
    }
);

// 코멘트조회
router.get('/comment/:id', async (req, res) => {
    const { id } = req.params;
    // const { user } = res.locals;
    // let userName = user.userName;

    const comment_list = await Comments.find({ postId: id });
    let comment = comment_list.reverse();
    // const [post] = await Posts.find({ postId: id });

    res.json({
        // user,
        // post,
        comment,
    });
});

// 코멘트수정시 기존 코멘트 가져오기
router.post('/updatecomment/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { commentId } = req.body;

    let comment = await Comments.find({ postId: id, _id: commentId });

    res.send({
        comment,
    });
});

// 코멘트수정 업데이트
router.put('/updatecomment/:id', authMiddleware, async (req, res) => {
    const { postId } = req.params.id;
    const { comment, commentId, userId, userName, userProfile, image, date } =
        req.body;
    console.log('ff', req.body);
    // const comment_Id = new Object(commentId);

    const existComment = await Comments.find({ _id: commentId });
    console.log('aa', existComment);

    if (existComment.length) {
        await Comments.updateOne({ _id: commentId }, { $set: { comment } });
    } else {
        return res.status(400).json({
            errorMessage: '잘못된 접근 입니다!!!',
        });
    }

    res.json({ success: '댓글이 수정되었습니다.' });
});

// 코멘트삭제
router.delete('/comment/:id', authMiddleware, async (req, res) => {
    let { id } = req.params; // 로그인을 한 후 맞는 사용자에게만 댓글 수정 ,삭제 버튼이 보이기때문에 필요가 없는가? -> 위쪽 조회에서 이미 userId와 비교가 되는것인가?
    let { commentId } = req.body; // 코멘트 아이디를 바디에서 받아온다 -> 어떻게 받아오지? 어디서?
    console.log("commentId", commentId)
    const existComment = await Comments.find({ _id: commentId });
    // commentId를 Comment데이터베이스에서 찾아 commentId 로 일치하는것을 찾앚서 existComment변수에 할당
    console.log("existComment", existComment)
    if (existComment.length) {
        // existComment가 있으면 length는 최소1개가 되어 조건식이 true,
        await Comments.deleteOne({ _id: commentId }); // 위의 조건이 true일때 Comments 데이터베이스에서 commentId가 동일한것을 찾아 삭제 시킴
    } else {
        return; // 조건식이 만족하지 않을때 return, 뒤의 실행문이 더이상 진행되지 않는다.
    }

    res.json({ success: '댓글이 삭제되었습니다.' });
});

module.exports = router;
