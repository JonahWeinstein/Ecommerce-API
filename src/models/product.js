const { sequelize, DataTypes } = require('../db/sequelize');




const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }
});

module.exports = Product;