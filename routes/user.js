const express = require('express');
const User = require('../schemas/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
//token key 보안처리
const fs = require("fs");
const mykey = fs.readFileSync(__dirname + "/../middlewares/key.txt").toString();
//multer-s3 미들웨어 연결
require('dotenv').config();
const upload = require('../S3/s3');

router.get('/', (req, res) => {
  res.send('this is root page');
});


//회원가입-아이디 중복 검사(정규식 사용)//
router.post("/idCheck", async (req, res, next) => {
  try {
    const regexr = /^[A-Za-z0-9]{4,10}$/;
    const {userId} = req.body;
    const IdCheck = await User.findOne({ userId });
    if (!regexr.test(userId)) {
      return res.status(403).send('아이디는 알파벳 대/소문자 또는 숫자만 사용가능하며 4~10글자여야 합니다.');
    } else if (IdCheck) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    res.status(201).send('사용할 수 있는 아이디입니다.');
  } catch (error) {
    console.error(error);
    // res.status(400).send('오류발생');
    next(error);
  };
});


// 회원가입(정규식 사용) + 프로필사진첨부 //
router.post("/signup", upload.single('userProfile'), async (req, res, next) => {
  const userProfile = req.file.location; // file.location에 저장된 객체imgURL
  try {
    const regexr = /^.{1,10}$/;
    const regexr1 = /^.{4,25}$/;
    const { userId, userName, password, pwConfirm, gender } = req.body;
    if (!regexr.test(userName)) {
      return res.status(403).send('닉네임은 1~10글자입니다.');
    } else if (!regexr1.test(password)) {
      return res.status(403).send('비밀번호는 4자리 이상입니다.');
    } else if (password !== pwConfirm) {
      return res.status(403).send('비밀번호가 일치하지 않습니다.');
    }
    await User.create({
      userId,
      userName,
      password,
      gender,
      userProfile,
    })
    res.status(201).send('회원가입이 완료되었습니다.');
  } catch (error) {
    console.error(error);
    res.status(400).send('아이디 중복체크를 해주세요.');
    next(error);
  };
});

//로그인//
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  const user = await User.findOne({ userId, password }).exec();

  if (!user) {
      res.status(400).send({
          errorMessage: '아이디 또는 패스워드를 확인해주세요',
      });
      return;
  }
  const token = jwt.sign({ userId: user.userId, userName: user.userName }, mykey);
  res.send({
      token,
  });
});


//토큰정보 보내주기//
router.post('/loginInfo', async (req, res) => { 
  const {token} = req.body;
  console.log(token)
  const userInfo = jwt.decode(token);
  res.json({ userInfo })
  console.log(userInfo);
});

module.exports = router;