const express = require('express');
const connect = require('./schemas');
const cors = require("cors");
const app = express();
const port = 3000;

connect();

const postsRouter = require('./routes/post');
const usersRouter = require('./routes/user');
const commentsRouter = require('./routes/comment');

const requestMiddleware = (req, res, next) => {
    console.log('Request URL:', req.originalUrl, ' - ', new Date());
    next();
};
app.use(express.static('static'));
app.use(express.json());
app.use(requestMiddleware);

app.use('/api', express.urlencoded({ extended: false }), postsRouter);
app.use('/api', express.urlencoded({ extended: false }), usersRouter);
app.use('/api', express.urlencoded({ extended: false }), commentsRouter);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

// //CORS 테스트 (https://test-cors.org)
// const corsOption = {
//     origin: "http://52.78.194.238",
//     credentials: true,
//   };
  
// app.use(cors(corsOption));
// app.get("/cors-test", (req, res) => {
// res.send("hi");
// });

app.listen(port, () => {
    console.log(port, '포트로 서버가 켜졌어요!');
});