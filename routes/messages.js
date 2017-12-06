var express = require('express');
var router = express.Router();
var User = require('../db/mongo.js');


// Implement the routes.
router.get('/messages', function (req, res, next) {
  var username = req.session.username;

  res.render('messages', { username: username });

});

router.post('/messages', function (req, res, next) {

	username = req.session.username;

	User.findOne( { username: username }, function(err, user) {
    		if (err) {
    			res.send(err);
    		} else {
    			if (user) {
    				var contactList = user.contacts;
   					var targetUser = contactList[0];

   					User.findOne( { username: username }, function(err, user) {
   						if (err) {
   							res.send(err);
   						} else {
   							if (user) {
   								var texts = undefined;

   								if ( user.texts === undefined ) {
   									texts = undefined;
                    unread = undefined;
   								} else {
                    //if texts exist, unread exists
   									texts = user.texts[targetUser];
                    user.removeUnread(targetUser);
                    unread = user.unread;
   								}

   								res.send({contactList: contactList, texts: texts, unread: unread});
   							}
   						}
   					})
    			}
    		}
    })

})




module.exports = router;