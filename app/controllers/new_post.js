var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  passport = require('passport'),
  aws = require('aws-sdk'),
  multer = require('multer'),
  multerS3 = require('multer-s3'),
  mime = require('mime'),
  config = require('../config');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/new_post', authenticationMiddleware(), function (req, res, next) {
  if(req.user) {
    var displayName = req.user.username;
    var isTeammate = req.user.TeamId;
    var userInfo = req.user;
    if(req.user.RoleId == 1) {
      var isStudent = true;
    } else {
      var isTeacher = true;
    }
  }

  res.render('protected/new_post', {
    title: 'Jump Institute',
    isLoggedIn: req.isAuthenticated(),
    username: displayName,
    isPartOfTeam: isTeammate,
    userInfo: userInfo,
    isStudent: isStudent,
    isTeacher: isTeacher
  });
});

var s3 = new aws.S3({
  accessKeyId: config.aws.access_key_id,
  secretAccessKey: config.aws.secret_access_key
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.aws.bucket,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '.' + mime.extension(file.mimetype))
    }
  })
});

router.post('/new_post', upload.fields([{ name: 'postPicture', maxCount: 1}, {name: 'postVideo', maxCount: 1}]), function (req, res, next) {
  if(typeof(req.files['postPicture']) == 'undefined') {
    var postPicture = null;
  } else {
    var postPicture = req.files['postPicture'][0].location;
  }

  if(typeof(req.files['postVideo']) == 'undefined') {
    var postVideo = null;
  } else {
    var postVideo = req.files['postVideo'][0].location;
  }

  db.Post.findOrCreate({
    where: {
      title: req.body.title,
      desc: req.body.desc,
      link: req.body.link,
      picture_url: postPicture,
      video_url: postVideo,
      UserId: req.user.id
    }
  }).then(function (postResult) {
    res.redirect('/my_feed');
  });

});

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
}
