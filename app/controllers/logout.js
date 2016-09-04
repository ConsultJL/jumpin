var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  passport = require('passport'),
  LocalStrategy = require('passport-local');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
