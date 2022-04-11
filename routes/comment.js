const express = require('express');
const Comments = require('../schemas/comment');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/', (req, res) => {
    res.send('this is root page');
});

module.exports = router;