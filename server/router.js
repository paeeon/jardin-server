var express = require('express');
var router = express.Router();
var User = require('../db/models/User');
var bcrypt = require('bcrypt');

router.post('/users', function(req, res) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  bcrypt.hash(req.body.pass, 4)
    .then(function(encrypted) {
       return User.create({
         email: req.body.email,
         pass: encrypted,
         firstName: req.body.firstName,
         lastName: req.body.lastName
       });
    }).then(function(user) {
      res.send(user);
    }).catch(errorHandler);
});

router.use('/', function(req, res) {
  res.send('hello world');
});

function errorHandler(error) {
  console.error(error);
  throw new Error(error);
}

module.exports = router;
