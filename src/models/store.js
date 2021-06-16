const { sequelize, DataTypes } = require('../db/sequelize')
const User = require('./user')

const Store = sequelize.define('Store', {
    store_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Store.belongsTo(User)

module.exports = Store