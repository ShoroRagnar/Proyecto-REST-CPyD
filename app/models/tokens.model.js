/**
 * 
 * Modelo de tokens
 *
 */
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
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Token;
}