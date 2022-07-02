const dbConfig = require('../database/conector');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAlliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


//inyección de modelos

db.attendance = require('./attendance.model')(sequelize, Sequelize);
db.student = require('./student.model')(sequelize, Sequelize);
db.classroom = require('./classroom.model')(sequelize, Sequelize);
db.subject = require('./subject.model')(sequelize, Sequelize);

db.attendance.belongsTo(db.student, {
    as: 'student',
    foreignKey: 'id_student'
});

db.attendance.belongsTo(db.classroom, {
    foreignKey: 'id_classroom',
    as: 'classroom'
});

db.attendance.belongsTo(db.subject, {
    foreignKey: 'id_subject',
    as: 'subject'
});


module.exports = db;

