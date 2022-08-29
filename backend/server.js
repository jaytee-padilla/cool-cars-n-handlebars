const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'cool_cars_handlebars',
  process.env.DB_USERNAME,
  process.env.DB_PW,
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);