var express = require('express');
var router = express.Router();
var User = require('../db/mongo.js');

// Implement the routes.
router.get('/register', function (req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  User.addUser(req.body.username, req.body.password, function(err) {
    if (err) res.send('error' + err);
    else res.send('new user registered with username ' + req.body.username);
  });
});

module.exports = router;