const db = require('../models');
const moment = require('moment');
const logger = require('../utils/logger');

const Student = db.student;
const Classroom = db.classroom;
const Subject = db.subject;
const Attendance = db.attendance;


/**
 * 
 * Llenado random de datos de prueba
 * 
 */
const seedStudent = async () => {
    try {
        for(let row=0;row<10;row++) {
            await Student.create({
                email: 'student'+row+'@a.a'
            }).then(() => {
                logger.info('Dato insertado en tabla Student');
            }).catch(error => {
                logger.error(`Error al insertar dato en tabla Student \n [Stacktrace] \n ${error.stack}`);
            })
        }
    }catch(error){
        logger.error(`Error al llenar datos en tabla Student \n [Stacktrace] \n ${error.stack}`);
    }
}

const seedClassroom = async () => {
    try {
        for(let row=0;row<10;row++){
            await Classroom.create({
                name: 'Sala ' + row
            }).then(() => {
                logger.info('Dato insertado en tabla Classroom');
            }).catch(error => {
                logger.error(`Error al insertar dato en tabla Classroom \n [Stacktrace] \n ${error.stack}`);
            })
        }
    }catch(error){
        logger.error(`Error al llenar datos en tabla Classroom \n [Stacktrace] \n ${error.stack}`);
    }
}

const seedSubject = async () => {
    try{
        for(let row=0;row<10;row++){
            await Subject.create({
                name: 'name ' + row
            }).then(() => {
                logger.info('Dato insertado en tabla Subject');
            }).catch(error => {
                logger.error(`Error al insertar dato en tabla Subject \n [Stacktrace] \n ${error.stack}`);
            })
        } 
    }catch(error){
        logger.error(`Error al llenar datos en tabla Subject \n [Stacktrace] \n ${error.stack}`);
    }
}

const seedAttendance = async () => {
    try{
        for(let row=0;row<10;row++){
            await Attendance.create({
                id_student: (row+1),
                id_classroom: (row+1),
                id_subject: (row+1),
                entrance: moment(),
                leaving: moment()
            }).then(() => {
                logger.info('Dato insertado en tabla Attendance');
            }).catch(error => {
                logger.error(`Error al insertar dato en tabla Attendance \n [Stacktrace] \n ${error.stack}`);
            })
        } 
    }catch(error){
        logger.error(`Error al llenar datos en tabla Attendance \n [Stacktrace] \n ${error.stack}`);
    }
}

module.exports = {
    seedStudent,
    seedClassroom,
    seedSubject, 
    seedAttendance
}