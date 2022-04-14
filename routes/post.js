const express = require('express');
const Posts = require('../schemas/post');
const Comments = require('../schemas/comment');
const router = express.Router();
require('dotenv').config();
const authMiddleware = require('../middlewares/auth-middleware');
const upload = require('../S3/s3');
const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/s3config.json');
const s3 = new AWS.S3();


router.get('/', (req, res) => {
    res.send('this is root page');
});

//포스트 목록 불러오기(코디추천 버튼 누르면 실행)
router.get('/postGet', async (req, res) => {
    const posts = await Posts.find();
    const posts1 = posts.reverse();
    res.json({
        posts: posts1,
    });
});

//글 등록하기API
router.post( '/postWrite', authMiddleware, upload.single('image'), // image upload middleware
  async (req, res, next) => {
    const today = new Date();
    const date = today.toLocaleString();
    const { user } = res.locals;
    let userProfile = user.userProfile;
    const { userId, title, content, userName } = req.body;
    const image = req.file?.location; // file.location에 저장된 객체imgURL
    try {
      await Posts.create({
        userId,
        title,
        userName,
        content,
        date,
        image,
        userProfile,
      });
      res.status(200).send({
        message: '포스트 완료',
      });
    } catch (err) {
      res.status(400).send({
        message: '포스트 실패',
      });
    }
  }
);

//글 수정하기API
router.post( '/postEdit/:id', upload.single('image'), // image upload middleware
  async (req, res, next) => {
    const { id } = req.params;
    const { content, title } = req.body;
    console.log(content, title, id)
    const o_id = new Object(id)
    const today = new Date();
    const date = today.toLocaleString();
    const image = req.file?.location; // file.location에 저장된 객체imgURL
    if(!image){
      return res.status(400).send({
        message: '이미지 파일을 추가해주세요.',
      });
    }
    console.log("image",image);
    const [detail] = await Posts.find({ _id : o_id }); 
    console.log(detail)
    const imagecheck = detail.image
    console.log(imagecheck)
    const deleteimage = imagecheck.split('/')[3];
    console.log(deleteimage)
    s3.putObject({
      Bucket: 'image-posting',
      Key: `${deleteimage}`
    }, (err, data) => {
      console.log(err)
      if (err) { 
        throw err
      }
    });
    
    try {
        await Posts.updateOne(
            { _id: o_id },
            { $set: { content, title, date, image } }
        );
        
        res.status(200).send({
          message: '수정 완료',
        });
    } catch (err) {
      res.status(400).send({
        message: '수정 실패',
      });
    }
  }
);

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

    const [detail] = await Posts.find({ _id : o_id }); 
    console.log("detail",detail)
    const imagecheck = detail.image
    console.log("imagecheck",imagecheck)
    const deleteimage = imagecheck.split('/')[3];
    console.log("deleteimage",deleteimage)
    if (existsPosts.length) {
        await Posts.deleteOne({ _id : o_id });
    }
    const existsComments = await Comments.find({ postId: o_id });
    if (existsComments.length) {
        await Comments.deleteMany({ postId: o_id });
    }

    s3.deleteObject({
      Bucket: 'image-posting',
      Key: deleteimage
    }, (err, data) => {
      console.log(err)
      if (err) { 
        throw err
      }
    });
    res.status(200).send({
      message: '삭제 완료',
    });
});

module.exports = router;