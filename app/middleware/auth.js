const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const logger = require('../utils/logger');
const db = require('../models');
const Token = db.token;
const Student = db.student;

module.exports = async (req, res, next) => {
    try{
        let token = req.headers['jwt'];
        if(token == null){
            logger.info('Acceso denegado');
            return res.status(403).json({
                ok: false,
                message: "Acceso denegado",
            });
        }
        const decoded = jwt.decode(token);
        if(await verifyToken(token, decoded.email)) {
            next();
        } else {
            logger.info('Acceso denegado');
            return res.status(403).json({
                ok: false,
                message: "Acceso denegado",
            });
        }
    }catch(error){
        logger.info('Acceso denegado');
        return res.status(400).json({
            message: "Acceso denegado" + error.stack
        });
    }
};

const verifyToken = async (token, email) => {
    let check = '';
    let getStudent = '';
    await Student.findOne({
        where: {
            email: email
        }
    }).then(data => {
        if(data){
            getStudent = data.id
        }
    })
    await Token.findOne({
        where: {
            token: token
        }
    }).then(data => {    
        if(data){
            if (getStudent == data.studentId) {
                check = true;
            } else {
                check = false;
            }
        }else{
            check = false;
        }
    })
    return check;
}