const moment = require('moment');
const db = require('../models');
const logger = require('../utils/logger');
const Attendance = db.attendance;
const Subject = db.subject;
const Classroom = db.classroom;
const Student = db.student;
const jwt = require('jsonwebtoken');

/**
 * COMENTAR CON ESTA ESTRUCTURA
 * @param {*} req 
 * @param {*} res 
 * @return res
 */

const getIn = async (req, res) => {
    let id = '';
    let decode = jwt.decode(req.headers['jwt']);
    try{
        if(req.body.classroom != null && req.body.subject != null && req.body.entrance != null){
            let classroom = getClassroom(req.body.classroom);
            let subject = getSubject(req.body.subject);
            let student = getStudent(decode.email);
            if(classroom == null){
                logger.error(`[POST] /v1/classroom/getin [404] Aula no encontrada`);
                res.status(404).json({
                    ok: false,
                    message: "Aula no encontrada",
                    created: moment()
                });
            }
            if(subject == null){
                logger.error(`[POST] /v1/classroom/getin [404] Asignatura no encontrada`);
                res.status(404).json({
                    ok: false,
                    message: "Asignatura no encontrada",
                    created: moment()
                });

            }
            if(student == null){
                Student.create({
                    email: decode.email,
                })
                .then(student => {
                    logger.info(`[POST] /v1/classroom/getin Estudiante creado`);
                    id = student.id;
                })
                .catch(error => {
                    logger.error(`Error al crear el estudiante \n [Stacktrace] \n ${error.stack}`);
                    res.status(500).json({
                        ok: false,
                        message: "Error desconocido",
                        created: moment()
                    });
                })
            }
            console.log(classroom);
            console.log(subject);
            console.log(student);
            await Attendance.create({
                id_classroom: classroom,
                id_subject: subject,
                id_student: student,
                entrance: moment(),
                leaving: moment()
            })
            .then(() => {
                logger.info(`[POST] /v1/classroom/getin [200] Entrada registrada`);
                res.status(200).json({
                    classroom: req.body.classroom,
                    subject: req.body.subject,
                    entrance: req.body.entrance,
                    leaving: req.body.entrance,
                    email: decode.email
                });
            })
            .catch(error => {
                logger.error(`[POST] /v1/classroom/getin [500] Error al registrar la entrada \n [Stacktrace] \n ${error.stack}`);
                res.status(500).json({
                    ok: false,
                    message: "Error desconocido",
                    created: moment()
                });
            });
        }else {
            res.status(400).json({
                ok: false,
                message: "Faltan datos",
                created: moment()
            })
        }
    }catch(error){
        res.status(500).json({
            ok: false,
            message: "Error desconocido",
            created: moment()
        });
    }
}

const getOut = async (req, res) => {
    try{
        if(req.body.classroom != null && req.body.subject !=null && req.body.entrance != null && req.body.leaving != null){
            let classroom = await getClassroom(req.body.classroom);
            let subject = await getSubject(req.body.subject);
            let student = await getStudent(decode.email);

            if(classroom == null){
                logger.error(`[POST] /v1/classroom/getin [404] Aula no encontrada`);
                res.status(404).json({
                    ok: false,
                    message: "Aula no encontrada",
                    created: moment()
                });
            }
            if(subject == null){
                logger.error(`[POST] /v1/classroom/getin [404] Asignatura no encontrada`);
                res.status(404).json({
                    ok: false,
                    message: "Asignatura no encontrada",
                    created: moment()
                });

            }
            if(student == null){
                logger.error(`[POST] /v1/classroom/getin [404] Estudiante no encontrado`);
                res.status(404).json({
                    ok: false,
                    message: "Estudiante no encontrado",
                    created: moment()
                });
            }
            await Attendance.update({
                leaving: req.body.leaving
            },{
                where: {
                    classroomId: classroom.id,
                    subjectId: subject.id,
                    studentId: student.id,
                    entrance: req.body.entrance
                }
            })
            .then(attendance => {
                logger.info(`[POST] /v1/classroom/getin [200] Salida registrada`);
                res.status(200).json({
                    classroom: req.body.classroom,
                    subject: req.body.subject,
                    entrance: req.body.entrance,
                    leaving: req.body.leaving,
                    email: decode.email
                });
            })
            .catch(error => {
                logger.error(`[POST] /v1/classroom/getin [500] Error al registrar la salida \n [Stacktrace] \n ${error.stack}`);
                res.status(500).json({
                    ok: false,
                    message: "Error desconocido",
                    created: moment()
                });
            })

        } else {
            logger.error(`[POST] /v1/classroom/getout [400] Faltan datos`);
            res.status(400).json({
                ok: false,
                message: "Faltan datos",
                created: moment()
            });
        }
        res.status(200).json({
            ok:true
        });
    }catch(error){
        res.status(500).json({
            ok: false,
            message: "Error desconocido",
            created: moment()
        })
    }
}

const attendances = async (req, res) => {
    let decode = jwt.decode(req.headers['jwt']);
    let getStudent = await Student.findOne({
        where: {
            email: decode.email
        }
    })
    try{
        await Attendance.findAll({
            include: [
                {
                    model: Classroom,
                    required: true,
                    as: 'classroom',
                    attributes: ['name']
                },
                {
                    model: Subject,
                    required: true,
                    as: 'subject',
                    attributes: ['name']
                },
                {
                    model: Student,
                    required: true,
                    as: 'student',
                    attributes: ['email']
                }
            ], where: {
                id_student: getStudent.id
            }
        })
        .then(attendances => {
            logger.info(`[GET] /v1/classroom/attendances [200] Listado de asistencias`);
            let dataAttendance = [];
            let row = {
                classroom: "",
                subject: "",
                entrance: "",
                leaving: "",
                email: ""
            };
            attendances.forEach(element => {
                row.classroom = element.classroom.name;
                row.subject = element.subject.name;
                row.entrance = element.entrance;
                row.leaving = element.leaving;
                row.email = element.student.email;
                dataAttendance.push(row);
                row = {
                    classroom: "",
                    subject: "",
                    entrance: "",
                    leaving: "",
                    email: ""
                }
            });
            res.status(200).json(dataAttendance);
        })
        .catch(error => {
            logger.error(`[GET] /v1/classroom/attendances [500] Error al obtener las asistencias \n [Stacktrace] \n ${error.stack}`);
            res.status(500).json({
                ok: false,
                message: "Error desconocido",
                created: moment()
            });
        });
    }catch(error){
        res.status(500).json({
            ok: false,
            message: "Error desconocido",
            created: moment()
        })
    }
}


const getClassroom = (classroom) => {
    let idClassroom = '';
    Classroom.findOne({
        where: {
            name: classroom
        },
        attributes: ['id']
    })
    .then(data => {
        console.log(data.id);
        if(!data){
            logger.error(`Aula no encontrada`);
        }
        idClassroom = data.id;
    })
    .catch(error => {
        logger.error(`Error al obtener la clase \n [Stacktrace] \n ${error.stack}`);
    });
    return idClassroom;
}

const getSubject = (subject) => {
    let idSubject = '';
    Subject.findOne({
        where: {
            name: subject
        },
        attributes: ['id']
    })
    .then(data => {
        if(!data){
            logger.error(`Asignatura no encontrada`);
        }
        idSubject = data.id;
    })
    .catch(error => {
        logger.error(`Error al obtener la asignatura \n [Stacktrace] \n ${error.stack}`);
    });
    return idSubject;
}

const getStudent = (email) => {
    let idStudent = '';
    Student.findOne({
        where: {
            email:email
        },
        attributes: ['id']
    })
    .then(data => {
        if(!data){
            logger.error(`Estudiante no encontrado`);
        }
        idStudent = data.id
    })
    .catch(error => {
        logger.error(`Error al obtener el estudiante \n [Stacktrace] \n ${error.stack}`);
    });
    return idStudent;

}

module.exports = {
    getIn,
    getOut,
    attendances,
}