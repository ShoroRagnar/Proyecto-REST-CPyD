const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const logger = require('../utils/logger');
const db = require('../models');
const { student } = require('../models');
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
        if(verifyToken(token, decoded.email)) {
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
            message: "Acceso denegado" + err.stack
        });
    }
};

const verifyToken = async (token, email) => {
    let check = '';
    console.log(email);
    let getStudent = '';
    await Student.findOne({
        where: {
            email: email
        }
    }).then(data => {
        getStudent = data.id
    })
    await Token.findOne({
        where: {
            token: token
        }
    }).then(data => {
        if (getStudent == data.id) {
            check = true;
        } else {
            check = false;
        }
    })
    return check;
}