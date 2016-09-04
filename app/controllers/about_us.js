var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  passport = require('passport');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/about_us', function (req, res, next) {
  if(req.user) {
    var displayName = req.user.username;
    var isTeammate = req.user.TeamId;
  }

  res.render('about_us', {
    title: 'Jump Institute',
    isLoggedIn: req.isAuthenticated(),
    username: displayName,
    isPartOfTeam: isTeammate
  });
});
