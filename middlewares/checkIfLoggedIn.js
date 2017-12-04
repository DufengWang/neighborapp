var User = require('../db/mongo.js')

var checkIfLoggedIn = function (req, res, next) {

  if (req.session.isAuthenticated) {
    next();
  } else {
  	res.redirect('/');
  }

};


module.exports = checkIfLoggedIn;
