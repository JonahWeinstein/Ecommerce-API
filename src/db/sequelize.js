const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2');


const sequelize  = new Sequelize(process.env.MYSQLDB_URL);
sequelize.sync()
module.exports = {
  sequelize,
  DataTypes
}
