var express = require('express');
var app = express();
var router = require('./router');
var bodyParser = require('body-parser');
var db = require('../db/connect');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(router);

app.listen(1337, function() {
  console.log('Listening on port 1337');
})
