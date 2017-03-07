var Sequelize = require('sequelize');
var env = require('../env');

var db = new Sequelize('jardin', 'lilyjen', env.dbPass, {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = db;

var User = require('./models/User');
