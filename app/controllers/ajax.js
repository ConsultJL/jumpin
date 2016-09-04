var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  passport = require('passport');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/ajax/comments', authenticationMiddleware(), function (req, res, next) {
  if(req.query.postid) {
    db.Comment.findAll({
      include: [db.User],
      where: {
        PostId: req.query.postid
      },
      raw: true
    }).then(function(comments) {
      res.json(JSON.parse(JSON.stringify(comments)));
    });
  } else {
    res.json({});
  }
});

router.post('/ajax/add_comment', authenticationMiddleware(), function (req, res, next) {
  if(req.body.text && req.body.postid) {
    db.Comment.findOrCreate({
      where: {
        text: req.body.text,
        PostId: req.body.postid,
        UserId: req.user.id
      }
    }).spread(function(comment, created) {
      if(created == false) {
        res.json({});
      } else {
        res.json({created: true});
      }
    });
  }
});

router.get('/ajax/get_team', authenticationMiddleware(), function (req, res, next) {
  db.User.findAll({
    where: {
      TeamId: '1'
    },
    raw: true
  }).then(function(comments) {
    res.json(JSON.parse(JSON.stringify(comments)));
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
