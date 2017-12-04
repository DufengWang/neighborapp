var express = require('express');
var router = express.Router();
var User = require('../db/mongo.js');

// Implement the routes.
router.get('/profile', function(req, res, next) {
	User.findOne( { username: req.session.username }, function(e, user) {
		if (e) throw e;

		if (user) {

			var firstName = user.profile.firstName;
			var lastName = user.profile.lastName;
			var gender = user.profile.gender;
			var homeAddress = user.profile.homeAddress;
			var hobbies = user.profile.hobbies;

			res.render('profile', {firstName: firstName, lastName: lastName, gender: gender, homeAddress: homeAddress, hobbies: hobbies});
		}
	})
});

router.post('/profile', function(req, res) {
	
	res.send({redirect: '/protected/profile/editProfile'});

});


module.exports = router;