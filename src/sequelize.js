const path = require('path')
const fs = require('file-system');
const {Sequelize, DataTypes} = require('sequelize');



var db = {};

const sequelize  = new Sequelize(process.env.MYSQLDB_URL);

const modelPath = path.join(__dirname, '/models')
fs
.readdirSync(modelPath)

.forEach(function(file) {
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





