module.exports = (sequelize, DataTypes) => {
    const Classroom = sequelize.define('classroom', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    return Classroom;
}