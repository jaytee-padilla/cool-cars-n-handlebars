const User = require('./User');
const Car = require('./Car');
const Vote = require('./Vote');
const Comment = require('./Comment');

// car - user data associations
User.hasMany(Car, {
  foreignKey: 'user_id'
});

Car.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'cascade'
});

// vote feature data associations
User.belongsToMany(Car, {
  through: Vote,
  as: 'voted_cars',
  foreignKey: 'user_id'
});

Car.belongsToMany(User, {
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

// comment feature data associations
// a user can have many comments
User.hasMany(Comment, {
  foreignKey: 'user_id'
});
// a comment can belong to a single user
Comment.belongsTo(User, {
  foreignKey: 'user_id'
});
// a car post can have many comments
Car.hasMany(Comment, {
  foreignKey: 'car_id'
});
// a comment can belong to a single car post
Comment.belongsTo(Car, {
  foreignKey: 'car_id'
});

module.exports = {
  User,
  Car,
  Vote,
  Comment
}