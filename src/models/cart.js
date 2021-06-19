

module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
    
        cart_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true
    })
    return Cart;
    // foreign key is ProductId
}