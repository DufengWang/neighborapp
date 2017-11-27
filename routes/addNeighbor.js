var express = require('express');
var router = express.Router();
var User = require('../middlewares/User');


// Implement the routes.
router.get('/addNeighbor', function (req, res, next) {
  var username = req.session.username;

  res.render('addNeighbor', { username: username });

});




module.exports = router;