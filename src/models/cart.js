const { sequelize, DataTypes } = require('../db/sequelize');

const Cart = sequelize.define('Cart', {
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_name: {
        type: DataTypes.STRING,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
})

module.exports = Cart;