var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  crypto = require('crypto');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/view_post', authenticationMiddleware(), function (req, res, next) {
  if(req.user) {
    var displayName = req.user.username;
    var isTeammate = req.user.TeamId;
  }

  db.Post.findOne({
    include: [db.User],
    where: {
      id: req.query.postId
    }
  }).then(function(post) {
    console.log(post);
    res.render('protected/view_post', {
      title: 'Jump Institute',
      isLoggedIn: req.isAuthenticated(),
      message: req.flash('loginMessage'),
      username: displayName,
      isPartOfTeam: isTeammate,
      post: post
    });
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
