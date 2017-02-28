var express = require('express');
var router = express.Router();
var User = require('../db/models/User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var env = require('../env');

router.post('/users/register', function(req, res) {
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

router.post('/users/login', function(req, res) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  var foundUser;
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(function(user) {
    foundUser = user;
    return bcrypt.hash(req.body.pass);
  }).then(function(encrypted) {
    // If the user successfully entered their password…
    if (encrypted === foundUser.pass) {
      jwt.sign(
        // payload
        {
          "iss": "playjard.in",
          "exp": "3 months",
          "firstName": foundUser.firstName,
          "lastName": foundUser.lastName,
          "email": foundUser.email,
          "id": foundUser.id
        },
        // secret
        env.jwtSecret,
        // algorithm
        { algorithm: 'RS256' },
        // callback
        function tokenSignDone(err, token) {
          if (err) {
            console.error('An error occurred while signing the JWT:', err);
          }
          console.log('JWT signed! here it is', token);
          res.send(token)
        }
      );
    } else {
      // If the user entered the wrong password…
      console.error('Wrong password entered!');
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
