const { sequelize, DataTypes } = require('../db/sequelize')
const Store = require('./store')
const Image = require('./image')


const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

Product.belongsTo(Store, { onDelete: 'cascade' })
Product.hasMany(Image, {onDelete: 'cascade'})

module.exports = Product;