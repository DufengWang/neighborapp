var express = require('express');
var router = express.Router();
var User = require('../db/mongo.js');

// Implement the routes.
router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res) {
  username = req.body.username;
  password = req.body.password;

  User.checkIfLegit(username, password, function(err, isRight) {
    if (err) {
      res.send('Error! ' + err);
    } else {
      if (isRight) {
        req.session.username = username;
        res.redirect('/protected');
      } else {
        res.send('wrong password');
      }
    }
  });

});

module.exports = router;
