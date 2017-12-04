var express = require('express');
var router = express.Router();
var User = require('../db/mongo.js');

// Implement the routes.
router.get('/editProfile', function(req, res) {
	console.log('point to edit profile')

	res.render('editProfile');
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