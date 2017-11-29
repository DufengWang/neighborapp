var express = require('express');
var router = express.Router();
var User = require('../db/mongo.js');


// Implement the routes.
router.get('/protected', function(req, res) {
  if (!req.session.username || req.session.username === '') {
    res.send('You tried to access a protected page');
  } else {
    var request = [];
    User.findOne( {username: req.session.username }, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        request = user.request.length;
        var username = req.session.username;
        res.render('protected', { username: username, request: request });
      }
    })
  }
});



module.exports = router;
