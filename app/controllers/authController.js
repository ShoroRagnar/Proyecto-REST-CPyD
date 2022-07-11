const moment = require('moment');
const request = require('request-promise');
const logger = require('../utils/logger');
const db = require('../models');
const jwt = require('jsonwebtoken');
const { student } = require('../models');

const Attendance = db.attendance;
const Subject = db.subject;
const Classroom = db.classroom;
const Student = db.student;
const Token = db.token;

/**
 * 
 * Realiza la autenticación a través de https://api.sebastian.cl/UtemAuth
 * 
 * @param {*} req Request
 * @param {*} res Response
 * 
 * @return Response al cliente
 */
const login = async (req, res) => {
    try{
        let options = {
            method: "POST",
            uri: "https://api.sebastian.cl/UtemAuth/v1/tokens/request",
            headers: {
                "Content-Type": "application/json",
                "X-API-TOKEN": "CPYD-L-202201",
                "X-API-KEY": "cadc348e006e4c3bac960faebf1fad28"
            },
            body: {
                successUrl: req.body["successUrl"],
                failedUrl: req.body["failedUrl"]
            },
            json: true
        }
        await request(options).then(function(body){
            res.status(200).json({
                token: body.token,
                sign: body.sign,
                redirectUrl: body.redirectUrl,
                created: body.created
            })
        }).catch(error =>{
            logger.error(`[POST] /v1/authentication/login [500] Error al autenticar \n [Stacktrace] \n ${error.stack}`);
            res.status(500).json({
                ok: false,
                message: "Error desconocido",
                created: moment()
            })
        })
    } catch(error){
        res.status(500).json({
            ok: false,
            message: "Error desconocido",
            created: moment()
        })
    }
}





/**
 * 
 * Realiza la obtención del estudiante
 * 
 * @param {*} req Request
 * @param {*} res Response
 * 
 * @return Response al cliente
 */
const result = async (req, res) => {
    let header = req.params.jwt;
    let decode = jwt.decode(header);
    let id = '';
    
    try{
        let student = await Student.findOne({
            where: {
                email: decode.email
            }
        }).then(data => {
            console.log(data.id);
            id = data.id
        });
        await Attendance.findAll({
            include: [{
                model: Student,
                required: true,
                as: 'student',
                attributes: ['email']
            }, {
                model: Classroom,
                required: true,
                as: 'classroom',
                attributes: ['name']
            },{
                model: Subject,
                required: true,
                as: 'subject',
                attributes: ['name']
            }], 
            where: {
                id_student: id
            }
        }).then(data => {
            logger.info(`[GET] /v1/auhtentication/result Asistencia del estudiante obtenida`);
            res.status(200).json({
                classroom: data[0].classroom.name,
                subject: data[0].subject.name,
                entrance: data[0].entrance,
                leaving: data[0].leaving,
                email: data[0].student.email
            });
        }).catch(error => {
            logger.error(`[POST] /v1/authentication/result [500] Error al obtener asistencia \n [Stacktrace] \n ${error.stack}`);
            res.status(500).json({
                ok: false,
                message: "Error desconocido",
                created: moment()
            })
        });
    }catch(error){
        logger.error(`[POST] /v1/authentication/result [500] Error al obtener datos \n [Stacktrace] \n ${error.stack}`);
        res.status(500).json({
            ok: false,
            message: "Error desconocido",
            created: moment()
        })
    }
}

/**
 * 
 * Realiza la obtención del token del estudiante
 * 
 * @param {*} req Request
 * @param {*} res Response
 * 
 * @return Response al cliente
 */
const getJWT = async (req, res) => {
    try{
        let options = {
            method: "GET",
            uri: `https://api.sebastian.cl/UtemAuth/v1/tokens/${req.body.token}/jwt`,
            headers: {
                "Content-Type": "application/json",
                "X-API-TOKEN": "CPYD-L-202201",
                "X-API-KEY": "cadc348e006e4c3bac960faebf1fad28"
            },
            json: true
        }
        await request(options).then(function(body){
            logger.info(`[POST] /v1/authentication/getjwt [200] token obtenido`);
            res.status(200).json({
                jwt: body.jwt,
                created: body.created
            });
        }).catch(error =>{
            logger.error(`[POST] /v1/authentication/getjwt [500] Error al obtener token \n [Stacktrace] \n ${error.stack}`);
            res.status(500).json({
                ok: false,
                message: "Error desconocido",
                created: moment()
            });
        })

    }catch(error){
        logger.error(`[POST] /v1/authentication/getjwt [500] Error al obtener token \n [Stacktrace] \n ${error.stack}`);
    }
}

/**
 * 
 * Realiza el guardado del token del estudiante
 * 
 * @param {*} req Request
 * @param {*} res Response
 * 
 * @return Response al cliente
 */
const saveToken = async (req, res) => {
    try{
        let decode = jwt.decode(req.body.jwt);
        let studentId = '';
        await Student.findOne({
            where: {
                email: decode.email
            }
        }).then(data => {
            if(data){
                studentId = data.id;
            }
        })
        .catch(error => {
            logger.error(`[POST] /v1/authentication/saveToken [500] Error al guardar el token \n [Stacktrace] \n ${error.stack}`);
            res.status(500).json({
                ok: false,
                message: "Error desconocido",
                created: moment()
            });

        });
        await Token.create({
            token: req.body.jwt,
            studentId: studentId,
            createdAt: moment(),
            updatedAt: moment()
        })
        .then(() => {
            logger.info(`[POST] /v1/authentication/saveToken [201] Token guardado`)
            res.status(201).json({
                ok: true
            });
        })
        .catch(error => {
            logger.error(`[POST] /v1/authentication/saveToken [500] Error al guardar el token \n [Stacktrace] \n ${error.stack}`);
            res.status(500).json({
                ok: false,
                message: "Error desconocido",
                created: moment()
            });
            
        });
    }catch(error){
        logger.error(`[POST] /v1/authentication/saveToken [500] Error al guardar el token \n [Stacktrace] \n ${error.stack}`);
        res.status(500).json({
            ok: false,
            message: "Error desconocido",
            created: moment()
        });
    }
}

module.exports = {
    login,
    result,
    getJWT,
    saveToken,
}