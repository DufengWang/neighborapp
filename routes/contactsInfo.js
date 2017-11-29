var express = require('express');
var router = express.Router();
var User = require('../middlewares/User');


router.get('/:username', function (req, res, next) {
  var currentUsername = req.session.username;
  var targetUsername = req.params.username;
  console.log(targetUsername);

  User.findOne( { username: targetUsername }, function (err, user) {
  	if (err) {
  		res.send(err);
  	} else {
  		if (user) {
  			var firstName = user.profile.firstName;
  			var lastName = user.profile.lastName;
  			var gender = user.profile.gender;
  			var homeAddress = user.profile.homeAddress;
  			var hobbies = user.profile.hobbies;

  			res.render('contactsInfo', { username: currentUsername, firstName: firstName, lastName: lastName, gender: gender, homeAddress: homeAddress, hobbies: hobbies })
  		}
  	}
  })

});


module.exports = router;