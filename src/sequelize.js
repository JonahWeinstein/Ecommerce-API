const path = require('path')
const fs = require('fs');
const {Sequelize, DataTypes} = require('sequelize');
const mysql = require("mysql2");

// create database object to hold all model definitions
var db = {};
const connection = mysql.createConnection(process.env.MYSQL_URL + '/' + process.env.DATABASE_NAME)
connection.query(
  `CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME}`,
  function (err, results) {
    console.log(err);
  }
);
const sequelize  = new Sequelize(process.env.MYSQL_URL + '/' + process.env.DATABASE_NAME);


const modelPath = path.join(__dirname, '/models')

fs.readdirSync(modelPath).forEach(function(file) {
  // extract each model out of module.exports and save them as part of db
  const model = require(path.join(__dirname, '/models', file))(sequelize, DataTypes)
  db[model.name] = model;
});
// checks if model has association and if so runs associate method with db (list of models) as argument
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync();

module.exports = db





