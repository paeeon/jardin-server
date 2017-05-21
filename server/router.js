var express = require('express');
var router = express.Router();
var chalk = require('chalk');
var fs = require('fs');
var User = require('../db/models/User');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var ms = require('ms');
var env = require('../env');

router.post('/users/register', function(req, res) {
  // res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
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
  // res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  console.log('This is the req.body', req.body);
  var foundUser;
  return User.findOne({
    where: {
      email: req.body.email
    }
  }).then(function(user) {
    if (!user) res.status(400).send("User doesn't exist!");
    foundUser = user;
    console.log(chalk.blue('this is the user', user));
    return bcrypt.compare(req.body.pass, user.pass);
  }).then(function(result) {
    console.log(chalk.blue("The result of the bcrypt compare is", result));
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
          console.log('Response sent. Now to save the JWT to the db...');
          foundUser.sessionJwt = token;
          return foundUser.save()
            .then(function(changedUser) {
              console.log(chalk.green('JWT saved to user!', changedUser));
            }).catch(errorHandler);
        }
      );
    } else {
      // If the user entered the wrong password…
      console.error('Wrong password entered!');
      res.status(400).send('Wrong password entered!');
    }
  })
});

router.patch('/users/logout/:id', function(req, res) {
  console.log(chalk.blue('from PATCH /users/logout, req: ', req.body));
  return User.findOne({
    where: {
      id: req.params.id
    }
  }).then(function(foundUser) {
    foundUser.sessionJwt = null;
    return foundUser.save();
  }).then(function(savedUser) {
    console.log(chalk.green(`User #${req.params.id}'s session has been removed! Here is the updated user: `, savedUser));
    res.status(200).send();
  }).catch(errorHandler);
});

router.get('/users/verify', function(req, res) {
  jwt.verify(req.get('Authorization').split(' ')[1], env.jwtSecret, function(err, decoded) {
    if (err) res.status(400).send(err)
    else res.status(200).send(decoded);
  });
});

function errorHandler(error) {
  console.error(error);
  throw new Error(error);
}

module.exports = router;
