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

router.get('/my_profile', authenticationMiddleware(), function (req, res, next) {
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

  res.render('protected/my_profile', {
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

router.post('/my_profile', upload.fields([{ name: 'coverPhotoUpload', maxCount: 1}, {name: 'fileToUpload', maxCount: 1}]), function (req, res, next) {
  if(typeof req.files['coverPhotoUpload'] != undefined) {
    var coverPhoto = req.files['coverPhotoUpload'][0].location;
  } else {
    var coverPhoto = req.user.coverPhoto;
  }
  if(typeof req.files['fileToUpload'] != undefined) {
    var profilePic = req.files['fileToUpload'][0].location;
  } else {
    var profilePic = req.user.profilePic;
  }
  db.User.update(
    {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      coverPhoto: coverPhoto,
      profilePic: profilePic
    },
    {
      where: {
        id: req.user.id
      }
    }
  ).then(function (result) {
    // This will update the current session.
    if(req.body) {
      req.session.passport.user.email = req.body.email;
      req.session.passport.user.firstName = req.body.firstName;
      req.session.passport.user.lastName = req.body.lastName;
      req.session.passport.user.coverPhoto = coverPhoto;
      req.session.passport.user.profilePic = profilePic;

      res.redirect('/my_profile');
    }
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
