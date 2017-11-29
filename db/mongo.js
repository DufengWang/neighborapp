var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/neighborapp', function (err) {
  if (err && err.message.includes('ECONNREFUSED')) {
    console.log('Error connecting to mongodb database: %s.\nIs "mongod" running?', err.message);
    process.exit(0);
  } else if (err) {
    throw err;
  } else {
    console.log('DB successfully connected. Adding seed data...');
  }
});

var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: Schema.Types.Mixed },
  request: { type: Array },
  contacts: { type: Array }
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

  newUser.save(cb);
}

userSchema.methods.editProfile = function(firstName, lastName, gender, homeAddress, hobbies, cb) {
  this.profile = {firstName: firstName, lastName: lastName, gender: gender, homeAddress: homeAddress, hobbies: hobbies};

  // console.log(this.username);
  // console.log(this.profile);

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
