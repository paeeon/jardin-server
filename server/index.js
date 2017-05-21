var express = require('express');
var app = express();
var router = require('./router');
var bodyParser = require('body-parser');
var db = require('../db/connect');
var morgan = require('morgan');
var chalk = require('chalk');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(morgan('dev'));

app.use(function(req, res, next) {
  res.set({
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Headers": "Authorization",
    "Access-Control-Allow-Methods": "POST, GET, PATCH"
  });
  next();
});

app.use(router);

app.listen(1337, function() {
  console.log('Listening on port 1337');
})
