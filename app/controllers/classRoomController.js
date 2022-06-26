const moment = require('moment');
const db = require('../models');
const logger = require('../utils/logger');
const Attendance = db.attendance;
const Subject = db.subject;
const Classroom = db.classroom;
const Student = db.student;


const getIn = async (req, res) => {
    let id = '';
    try{
        if(req.body.classroom != null && req.body.subject !=null && req.body.entrance != null){
            
            let classroom = await getClassroom(req.body.classroom);
            let subject = await getSubject(req.body.subject);
            let student = await getStudent(req.headers.email);
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
                    email: req.headers.email,
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

            await Attendance.create({
                classroomId: classroom.id,
                subjectId: subject.id,
                studentId: student.id,
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
                    email: req.headers.email
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
            let student = await getStudent(req.headers.email);

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
                    email: req.headers.email
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
            ],
        })
        .then(attendances => {
            logger.info(`[GET] /v1/classroom/attendances [200] Listado de asistencias`);
            res.status(200).json(attendances);
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
    return Classroom.findOne({
        where: {
            name: classroom
        },
        attributes: ['id']
    })
    .then(classroom => {
        if(classroom == null){
            logger.error(`Aula no encontrada`);
        }
    })
    .catch(error => {
        logger.error(`Error al obtener la clase \n [Stacktrace] \n ${error.stack}`);
    });
}

const getSubject = (subject) => {
    return Subject.findOne({
        where: {
            name: subject
        },
        attributes: ['id']
    })
    .then(subject => {
        if(subject == null){
            logger.error(`Asignatura no encontrada`);
        }
    })
    .catch(error => {
        logger.error(`Error al obtener la asignatura \n [Stacktrace] \n ${error.stack}`);
    });
}

const getStudent = (email) => {
    return Student.findOne({
        where: {
            email:email
        },
        attributes: ['id']
    })
    .then(student => {
        if(student == null){
            logger.error(`Estudiante no encontrado`);
        }
    })
    .catch(error => {
        logger.error(`Error al obtener el estudiante \n [Stacktrace] \n ${error.stack}`);
    });

}

module.exports = {
    getIn,
    getOut,
    attendances,
}