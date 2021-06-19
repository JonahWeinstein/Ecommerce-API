
module.exports = (sequelize, DataTypes) => {
    const Store = sequelize.define('Store', {
        store_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    
    Store.associate = function(models) {
        Store.hasMany(models.Product, {onDelete: 'cascade'} )
    }
    return Store
}