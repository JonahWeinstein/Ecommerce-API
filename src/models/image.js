const { sequelize, DataTypes } = require('../db/sequelize')
const Product = require('./product')

const Image = sequelize.define('Image', {
    data: {
        type: DataTypes.BLOB('long'),
        allowNull: false
    }
})


module.exports = Image