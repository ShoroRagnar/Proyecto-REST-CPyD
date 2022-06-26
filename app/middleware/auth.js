const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const logger = require('../utils/logger');

module.exports = async (req, res, next) => {
    try{
        const header = req.headers['authorization'];
        let token = header.replace('Bearer', '');
        if(token == null){
            logger.info('Acceso denegado');
            return res.status(403).json({
                ok: false,
                message: "Acceso denegado",
            });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        next();
    }catch(error){
        logger.info('Acceso denegado');
        return res.status(400).json({
            message: "Acceso denegado" + err.stack
        });
    }
}