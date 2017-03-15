var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require('../db/models/User');
var bcrypt = require('bcrypt');
var session = require('express-session');
var ms = require('ms');
var env = require('../env');

// REMINDER: Add functionality here later so that the secure: true key-value
// pair is set when in production. 
app.use(session({
  secret: env.sessionsSecret,
  httpOnly: true,
  cookie: {
    maxAge: 60000
  }
}));

router.post('/users/register', function(req, res) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  bcrypt.hash(req.body.pass, 4).then(function(encrypted) {
    return User.create({email: req.body.email, pass: encrypted, firstName: req.body.firstName});
  }).then(function(user) {
    res.send(user);
  }).catch(errorHandler);
});

router.post('/users/login', function(req, res) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  console.log('This is the req.body', req.body);
  var foundUser;
  return User.findOne({
    where: {
      email: req.body.email
    }
  }).then(function(user) {});
})

router.use('/', function(req, res) {
  res.send('hello world');
});

function errorHandler(error) {
  console.error(error);
  throw new Error(error);
}

module.exports = router;
