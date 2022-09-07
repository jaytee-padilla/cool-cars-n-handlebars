const User = require('./User');
const Car = require('./Car');

// data associations
User.hasMany(Car, {
  foreignKey: 'user_id'
});

Car.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'cascade'
});

module.exports = {
  User,
  Car
}