const path = require('path')
const fs = require('fs');
const {Sequelize, DataTypes} = require('sequelize');

// create database object to hold all model definitions
var db = {};

const sequelize  = new Sequelize('ecommerce_api','root','secretpassword', {
  host: 'localhost',
  dialect: 'mysql'
});

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





