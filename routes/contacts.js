var express = require('express');
var router = express.Router();
var User = require('../middlewares/User');


// Implement the routes.
router.get('/contacts', function (req, res, next) {
  var username = req.session.username;

  res.render('contacts', { username: username });

});






module.exports = router;