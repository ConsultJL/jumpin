var express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  if(req.user) {
    var displayName = req.user.username;
    var isTeammate = req.user.TeamId;
  }

  res.render('index', {
    title: 'Jump Institute',
    isLoggedIn: req.isAuthenticated(),
    username: displayName,
    isPartOfTeam: isTeammate
  });
  // });
});
