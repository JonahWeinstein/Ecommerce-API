
module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        data: {
            type: DataTypes.BLOB('long'),
            allowNull: false
        }
    });
    return Image;
}