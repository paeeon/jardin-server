var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require('../db/models/User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var ms = require('ms');
var env = require('../env');

router.post('/users/register', function(req, res) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  bcrypt.hash(req.body.pass, 4)
    .then(function(encrypted) {
       return User.create({
         email: req.body.email,
         pass: encrypted,
         firstName: req.body.firstName
       });
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
  }).then(function(user) {
    foundUser = user;
    return bcrypt.compare(req.body.pass, user.pass);
  }).then(function(result) {
    console.log("The result of the bcrypt compare is", result);
    // If the user successfully entered their password…
    if (result) {
      return jwt.sign(
        // payload
        {
          "iss": "playjard.in",
          "exp": ms('2 weeks'),
          "firstName": foundUser.firstName,
          "email": foundUser.email,
          "id": foundUser.id
        },
        // secret
        env.jwtSecret,
        // algorithm
        { algorithm: 'HS256' },
        // callback
        function tokenSignDone(err, token) {
          if (err) {
            console.error(err);
            throw new Error('An error occurred while signing the JWT!');
          }
          console.log('JWT signed! here it is', token);
          res.status(200).send(token);
        }
      );
    } else {
      // If the user entered the wrong password…
      console.error('Wrong password entered!');
      res.status(400).send('Wrong password entered!');
    }
  })
})

router.use('/', function(req, res) {
  res.send('hello world');
});

function errorHandler(error) {
  console.error(error);
  throw new Error(error);
}

module.exports = router;
