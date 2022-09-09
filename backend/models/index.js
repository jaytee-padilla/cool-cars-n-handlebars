const User = require('./User');
const Car = require('./Car');
const Vote = require('./Vote');

// data associations
User.hasMany(Car, {
  foreignKey: 'user_id'
});

Car.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'cascade'
});

User.belongsToMany('Car', {
  through: Vote,
  as: 'voted_cars',
  foreignKey: 'user_id'
});

Car.belongsToMany('User', {
  through: Vote,
  as: 'voted_cars',
  foreignKey: 'car_id'
});

Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Car, {
  foreignKey: 'car_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Car.hasMany(Vote, {
  foreignKey: 'car_id'
});

module.exports = {
  User,
  Car,
  Vote
}