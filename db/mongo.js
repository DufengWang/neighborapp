var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/test2', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('Database running...');
  }
});

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: Schema.Types.Mixed },
  request: { type: Array },
  contacts: { type: Array },
  socketID: { type: Schema.Types.Mixed },
  texts: { type: Schema.Types.Mixed },
  unread: { type: Schema.Types.Mixed }
});

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

userSchema.statics.addUser = function(username, password, cb) {
  var newUser = new this({ username: username, password: password});
  newUser.editProfile('', '', '', '', '');
  newUser.unread = {};

  newUser.save(cb);
}

//initialize profile & texts
userSchema.methods.editProfile = function(firstName, lastName, gender, homeAddress, hobbies, cb) {
  this.profile = {firstName: firstName, lastName: lastName, gender: gender, homeAddress: homeAddress, hobbies: hobbies};
  // this.texts = { initialize: 'nothing' };

  this.save(cb);
}

userSchema.methods.addSocketID = function(id, cb) {
  this.socketID = id;

  // console.log(this.username);
  // console.log(this.socketID);

  this.save(cb);
}

userSchema.methods.addText = function(username, text, status, cb) {
  var username = username;
  var text = text;
  var status = status;

  console.log(this.username);

  // console.log('Add Text');
  // console.log(this.texts);
  // console.log(typeof this.texts);

  if ( this.texts === undefined ) {
    this.texts = {};
    this.texts[username] = [];
    this.texts[username].push([text, status]);

  } else if ( this.texts.hasOwnProperty(username) ) {
    console.log('username exists');
    this.texts[username].push([text, status]);

  } else {
    this.texts[username] = [];
    this.texts[username].push([text, status]);
  }

  //clear texts
  // this.texts = {};

  console.log(this.texts);

  //nested object save needs this
  this.markModified('texts');
  this.save(cb);
}



userSchema.methods.addUnread = function(targetUsername, cb) {
  var username = targetUsername;

  console.log('this.unread before save:');
  console.log(this.unread);

  if (this.unread === undefined) {
    this.unread = {};
    this.unread[username] = 1;
  } else if (this.unread[username]) {
    this.unread[username] = this.unread[username] + 1;
  } else {
    this.unread[username] = 1;
  }

  console.log(this.username);
  console.log('this.unread after save:');
  console.log(this.unread);

  this.markModified('unread');
  this.save(cb);

}

userSchema.methods.removeUnread = function(targetUsername, cb) {
  var username = targetUsername;

  console.log('this.unread remove before save:');
  console.log(this.unread);

  if (this.unread) {
    this.unread[username] = 0;
  }

  console.log(this.username);
  console.log('this.unread remove after save:');
  console.log(this.unread);

  this.markModified('unread');
  this.save(cb);

}

userSchema.methods.addRequest = function(username) {

  if (!this.request.includes(username)) {
    this.request.push(username);
    console.log(this.username + ' added: ' + username);
  } else {
    console.log('it already exists');
  }

  // this.request = [];
  // this.contacts = [];


  this.save();
}

userSchema.methods.acceptRequest = function(username) {
  if (!this.contacts.includes(username)) {
    this.contacts.push(username);
    console.log(this.username + ' has become a contact with ' + username);
    console.log(this.contacts);

    var index = this.request.indexOf(username);
    this.request.splice(index, 1);
  } else {
    console.log('contact already exists');
  }


  this.save();
}

userSchema.methods.declineRequest = function(username) {

  var index = this.request.indexOf(username);
  this.request.splice(index, 1);

  this.save();
}

userSchema.statics.checkIfLegit = function(username, password, cb) {
  this.findOne({ username: username }, function(err, user) {
    if (!user) cb('no user');
    else {
      bcrypt.compare(password, user.password, function(err, isRight) {
        if (err) return cb(err);
        cb(null, isRight);
      });
    };
  });
}

module.exports = mongoose.model('User', userSchema);
