const db = require('../models');
const moment = require('moment');
const logger = require('../utils/logger');
const seeder = require('./seeder');

const Student = db.student;
const Classroom = db.classroom;
const Subject = db.subject;
const Attendance = db.attendance;
const Token = db.token;


/**
 * 
 * Inicialización de la base de datos
 * 
 * @param {*} req Request
 * @param {*} res Response
 * 
 * @return Response al cliente
 */
const init = async (req, res) => {
    try{
        await Student.sync({force: true});
        await Classroom.sync({force: true});
        await Subject.sync({force: true});
        await Attendance.sync({force: true});
        await Token.sync({force: true});

        logger.info('Base de datos inicializada');

        seeder.seedStudent();
        seeder.seedClassroom();
        seeder.seedSubject();
        seeder.seedAttendance();

        res.status(200).json({
            ok: true,
            message: "Base de datos inicializada",
            created: moment()
        })

    }catch(error){
        logger.error(`Error al inicializar la base de datos \n [Stacktrace] \n ${error.stack}`);
        res.status(500).json({
            ok: false,
            message: "Error desconocido",
            created: moment()
        });
    }
}

module.exports = init;