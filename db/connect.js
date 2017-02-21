var Sequelize = require('sequelize');
var env = require('../env');

var db = new Sequelize('jardin', 'paeeon', null, {
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

// // force: true will drop the table if it already exists
// User.sync({force: true}).then(function () {
//   // Table created
//   return User.create({
//     firstName: 'John',
//     lastName: 'Hancock'
//   });
// });
