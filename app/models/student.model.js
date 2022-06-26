module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('student', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    return Student;
}