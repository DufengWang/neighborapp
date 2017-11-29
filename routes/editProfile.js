var express = require('express');
var router = express.Router();
var User = require('../db/mongo.js');

// Implement the routes.
router.get('/editProfile', function(req, res, next) {
	User.findOne( { username: req.session.username }, function(e, user) {
		if (e) throw e;

		if (user) {

			var firstName = user.profile.firstName;
			var lastName = user.profile.lastName;
			var gender = user.profile.gender;
			var homeAddress = user.profile.homeAddress;
			var hobbies = user.profile.hobbies;

			res.render('editProfile', {firstName: firstName, lastName: lastName, gender: gender, homeAddress: homeAddress, hobbies: hobbies});
		}
	})
});

router.post('/editProfile', function(req, res) {

	User.findOne({ username: req.session.username }, function(e, user) {
	  if (e) throw e;

	  if (user) {
	  		var firstName = req.body.firstName;
	  		var lastName = req.body.lastName;
	  		var gender = req.body.gender;
	  		var homeAddress = req.body.homeAddress;
	  		var hobbies = req.body.hobbies;

	  		user.editProfile(firstName, lastName, gender, homeAddress, hobbies, function(err) {
	  			if (err) res.send('error' + err);
    			else res.send('Profile edit successful, ' + req.session.username);
	  		})
	  }
	});

});


module.exports = router;