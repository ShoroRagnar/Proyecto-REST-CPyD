const moment = require('moment');
const request = require('request-promise');
const logger = require('../utils/logger');
const db = require('../models');
const jwt = require('jsonwebtoken');

const Attendance = db.attendance;
const Subject = db.subject;
const Classroom = db.classroom;
const Student = db.student;

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

const result = async (req, res) => {
    let header = req.headers['jwt'];
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


module.exports = {
    login,
    result
}