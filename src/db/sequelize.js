const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2');


const sequelize  = new Sequelize('mysql://admin:hgAS23nbIl@127.0.0.1:3306/products');
sequelize.sync()
module.exports = {
  sequelize,
  DataTypes
}
