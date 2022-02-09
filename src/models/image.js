
module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        data: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        }, 
        order: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    return Image;
}