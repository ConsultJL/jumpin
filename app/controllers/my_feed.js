var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  passport = require('passport');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/my_feed', authenticationMiddleware(), function (req, res, next) {
  if(req.user) {
    var displayName = req.user.firstName + ' ' + req.user.lastName;
  }

  db.Post.findAll({
    where: {
      UserId: req.user.id
    },
    include: [db.User]
  }).then(function(post) {
    res.render('protected/my_feed', {
      title: 'Jump Institute',
      isLoggedIn: req.isAuthenticated(),
      username: displayName,
      posts: post,
      coverPhoto: req.user.coverPhoto,
      profilePic: req.user.profilePic,
      isPartOfTeam: req.user.TeamId
    });
  })
});

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
}
