var Sequelize = require('sequelize');

var db = new Sequelize('jardin', 'lilyjen', null, {
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
