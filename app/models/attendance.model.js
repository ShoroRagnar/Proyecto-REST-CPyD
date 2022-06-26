module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define('attendance', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_student: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_classroom: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_subject: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        entrance: {
            type: DataTypes.DATE,
            allowNull: false
        },
        leaving: {
            type: DataTypes.DATE,
            allowNull: false,
        }
        
    });

    return Attendance;
}