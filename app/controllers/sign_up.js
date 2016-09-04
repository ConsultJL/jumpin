var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  crypto = require('crypto');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/sign_up', function (req, res, next) {
  if(req.user) {
    var displayName = req.user.username;
    var isTeammate = req.user.TeamId;
  }

  res.render('sign_up', {
    title: 'Jump Institute',
    isLoggedIn: req.isAuthenticated(),
    message: req.flash('loginMessage'),
    username: displayName,
    isPartOfTeam: isTeammate
  });
});

router.post('/sign_up', function (req, res, next) {
  if(req.body.password == req.body.confirm_password) {
    if(req.body.email) {
      if(req.body.role == 1) {
        var roleId = 1;
      } else {
        var roleId = 2;
      }
      db.User.findOrCreate({
        where: {
          email: req.body.email,
          username: req.body.username,
          password: crypto.createHash('md5').update(req.body.password).digest("hex"),
          RoleId: roleId,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          profilePic: req.body.profilePic
        }
      }).spread(function(user, created) {
        if(created == false) {
          req.flash('loginMessage', "This email address is already registered! Please login with it.");
          res.redirect('/login');
        } else {
          req.flash('loginMessage', "Your account was successfully created! Please login!");
          res.redirect('/login');
        }
      });
    } else {
      req.flash('loginMessage', "You must enter a valid email address");
      res.redirect('/sign_up');
    }
  } else {
    req.flash('loginMessage', "Your passwords don't match!");
    res.redirect('/sign_up');
  }
});
