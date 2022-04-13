const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/awsConfig.json');
const s3 = new AWS.S3();
const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const env = require('dotenv');

// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//     region: process.env.AWS_BUCKET_REGION,
// });

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'image-posting',
        // contentType: multerS3.AUTO_CONTENT_TYPE,  // image/jpeg
        key: function (req, file, cb) {
            const extension = path.extname(file.originalname);
            cb(null, Date.now().toString() + extension);
        },
        acl: 'public-read-write', // 모든 권한을 부여한다!
    }),
});

module.exports = upload;
