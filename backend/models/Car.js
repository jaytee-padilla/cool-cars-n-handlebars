const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Vote = require('./Vote');

class Car extends Model {
  static upvote(body, models) {
    return models.Vote.create({
      user_id: body.user_id,
      car_id: body.car_id
    })
    .then(() => {
      return Car.findOne({
        where: {
          id: body.car_id
        },
        attributes: [
          'id',
          'year_made',
          'brand',
          'model',
          'drivetrain',
          'image_url',
          'created_at',
          [
            // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
            sequelize.literal(
              '(SELECT COUNT(*) FROM vote WHERE car.id = vote.car_id)'
            ),
            'vote_count',
          ],
        ]
      })
    })
  }
}

Car.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    year_made: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    drivetrain: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING,
      validate: {
        isURL: true
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'car'
  }
);

module.exports = Car;