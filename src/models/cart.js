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
// foreign key is ProductId
Cart.belongsTo(Product, {onDelete: 'cascade'})

module.exports = Cart;