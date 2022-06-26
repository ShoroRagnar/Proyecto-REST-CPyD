module.exports = (sequelize, DataTypes) => {
    const Subject = sequelize.define('subject', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
}