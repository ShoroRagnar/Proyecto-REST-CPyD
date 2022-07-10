module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define('tokens', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        id_student: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Token;
}