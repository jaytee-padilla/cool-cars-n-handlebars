const User = require('./User');
const Car = require('./Car');

// data associations
User.hasMany(Car, {
  foreignKey: 'user_id'
});

Car.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = {
  User,
  Car
}