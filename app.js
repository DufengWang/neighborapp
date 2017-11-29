var express = require('express');
var app = express();
var uuid = require('node-uuid');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var login = require('./routes/login')
var register = require('./routes/register')
var protected = require('./routes/protected')
var editProfile = require('./routes/editProfile')
var addNeighbor = require('./routes/addNeighbor')
var contacts = require('./routes/contacts')
var contactsInfo = require('./routes/contactsInfo')
var messages = require('./routes/messages')
var User = require('./middlewares/User')

var http = require( "http" ).createServer( app );
var io = require( "socket.io" )( http );
http.listen(8080, "127.0.0.1");

// Serve static pages
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.io = io;


// Generate a random cookie secret for this app
var generateCookieSecret = function () {
  return 'iamasecret' + uuid.v4();
};
// TODO (Part 3) - Use the cookieSession middleware. The above function
// can be used to generate a secret key. Make sure that you're not accidentally
// passing the function itself - you need to call it to get a string.
app.use(cookieSession({
  name: 'session',
  secret: generateCookieSecret()
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  if (req.session.username && req.session.username !== '') {
    res.redirect('/protected');
  } else {
    res.render('index');
  }
});

app.get('/logout', function(req, res) {
  req.session.username = '';
  res.render('index');
});

// Mount your routers. Please use good style here: mount a single router per use() call,
// preceded only by necessary middleware functions.
// DO NOT mount an 'authenticating' middleware function in a separate call to use().
// For instance, the API routes require a valid key, so mount checkValidKey and apiRouter in the same call.
app.use('/', login);
app.use('/', register);
app.use('/', protected);
app.use('/protected', editProfile);
app.use('/protected', addNeighbor);
app.use('/protected', contacts);
app.use('/protected/contacts', contactsInfo);
app.use('/protected', messages);

//socket.io

  io.on('connection', function(socket) {
    console.log('server connected');

    socket.on('SOS', function(username) {
      socket.broadcast.emit('userSOS', username);
    })

    socket.on('addUser', function(data) {

    	var targetUser = data[0];
    	var currentUser = data[1];

      User.findOne( { username: targetUser }, function(err, user) {
        if (err) {
          res.send(err);
        } else {
          if (user) {
            response = targetUser + ' add request sent.'
            socket.emit('addUserRequest', response);

            user.addRequest(currentUser);

          } else {
            response = targetUser + ' does not exist.'
            socket.emit('addUserRequest', response);
          }
        }
      });
    })

    //get the request list for add neighbor page
    socket.on('clientConnected', function(username) {
    	User.findOne( {username: username }, function(err, user) {
        if (err) {
          res.send(err);
        } else {
          if (user) {
            var requestList = user.request;
            socket.emit('requestList', requestList);
          }
        }
      })
    })

    //accept friend request
    socket.on('acceptRequest', function(data) {
    	var targetUser = data[0];
    	var currentUser = data[1];

    	console.log('targetUser ' + targetUser);
    	console.log('currentUser ' + currentUser);

    	User.findOne( { username: targetUser }, function(err, user) {
    		if (err) {
    			res.send(err);
    		} else {
    			if (user)  {
    				response = targetUser + ' has been added to your contacts.'
    				socket.emit('addUserRequest', response);

    				//add current user to the target users contact
    				user.acceptRequest(currentUser);

    				//add target user to current users contact
    				User.findOne( { username: currentUser }, function(err, user) {
    					if (err) {
    						res.send(err);
    					} else {
    						if (user) {
    							user.acceptRequest(targetUser);
    						}
    					}
    				})

    				socket.emit('requestHandled', targetUser);
    			}
    		}
    	})
    })

    socket.on('declineRequest', function(data) {
    	var targetUser = data[0];
    	var currentUser = data[1];

    	User.findOne( { username: targetUser }, function(err, user) {
    		if (err) {
    			res.send(err);
    		} else {
    			if (user) {
    				response = targetUser + ' is out of your way.'

    				//delete target user from current user request list
    				User.findOne( { username: currentUser }, function(err, user) {
    					if (err) {
    						res.send(err);
    					} else {
    						if (user) {
    							user.declineRequest(targetUser);
    						}
    					}
    				})

    				socket.emit('addUserRequest', response);
    				socket.emit('requestHandled', targetUser);

    			}
    		}
    	})
    })

    socket.on('getContacts', function(username) {

    	User.findOne( { username: username }, function(err, user) {
    		if (err) {
    			res.send(err);
    		} else {
    			if (user) {
    				var contactList = user.contacts;
    				socket.emit('contactList', contactList);
    			}
    		}
    	})
    })

  })


// Mount your error-handling middleware.
// Please mount each middleware function with a separate use() call.
// app.use(handleError);
// app.use(pageNotFound);

module.exports = app;
