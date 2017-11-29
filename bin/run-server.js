#!/usr/bin/env node
// Seed the database, then start the server
// require('../db/seed.js')(function (err) {
//   if (err) {
//     console.error(err);
//     process.exit(1);
//   } else {
//     console.log('Connect to Database');
//     var app = require('../app');

//     app.set('port', process.env.PORT || 3000);

//     var server = app.listen(app.get('port'), function () {
//       console.log('Express server listening on port %d', server.address().port);
//     });
//   }
// });

var mongodb = require('../db/mongo.js')
var app = require('../app')

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port %d', server.address().port);
});