const path = require('path')
var basename = path.basename(module.filename);
const fs = require('file-system');
const {Sequelize, DataTypes} = require('sequelize');



var db = {};

const sequelize  = new Sequelize(process.env.MYSQLDB_URL);


fs
.readdirSync(__dirname)
.filter(function(file) {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
})
.forEach(function(file) {
  const model = require(path.join(__dirname, file))(sequelize, DataTypes)
  db[model.name] = model;
});
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync();

module.exports = db




