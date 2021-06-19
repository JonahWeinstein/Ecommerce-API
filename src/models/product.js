

module.exports = (sequelize, DataTypes) => {
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
    
    Product.associate = function(models) {
        Product.hasMany(models.Image)
    }
    return Product;
    
}