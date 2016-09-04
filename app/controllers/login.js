var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  crypto = require('crypto'),
  bcrypt = require('bcrypt-nodejs');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/login', function (req, res, next) {
  if(req.user) {
    var isTeammate = req.user.TeamId;
  }

  res.render('login', {
    title: 'Jump Institute',
    isLoggedIn: req.isAuthenticated(),
    message: req.flash('loginMessage'),
    isPartOfTeam: isTeammate
  });
});

passport.use(new LocalStrategy ({
    passReqToCallback: true
  },
  function(req, username, password, done) {
    db.User.findOne({
      where: {username: username, password: crypto.createHash('md5').update(password).digest("hex")}
    }).then(function (user) {
      if(user) {
        done(user);
      } else {
        done(null, false, req.flash('loginMessage', "Incorrect login, please try again!"));
      }
    });
  }
));

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(user) {
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/my_feed');
    });
  })(req, res, next);
});
