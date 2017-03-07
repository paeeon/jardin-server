var db = require('../connect');
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

var User = db.define('user', {
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  pass: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

// force: true will drop the table if it already exists
User.sync().then(function () {
  // Table created
  return bcrypt.hash('woohoo', 4);
}).then(function(encrypted) {
  return User.create({
    firstName: 'John',
    email: 'jhancock@gmail.com',
    pass: encrypted
  });
}).catch(function(error) {
  console.error('Error seeding the DB with John Hancock. ', error)
});

module.exports = User;
