const { sequelize, DataTypes } = require('../db/sequelize');
const Product = require('./product')

const Cart = sequelize.define('Cart', {
    
    cart_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
})
Cart.belongsTo(Product)

module.exports = Cart;