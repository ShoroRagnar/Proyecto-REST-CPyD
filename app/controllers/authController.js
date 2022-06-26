const moment = require('moment');
const request = require('request-promise');
const logger = require('../utils/logger');

const login = async (req, res) => {
    try{
        let options = {
            method: "POST",
            uri: "https://api.sebastian.cl/UtemAuth/v1/tokens/request",
            headers: {
                "X-API-TOKEN": "",
                "X-API-KEY": ""
            },
            body: {
                successUrl: "",
                failedUrl: ""
            }
        }
        let auth = await request(options).then(function(body){
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
    try{

    } catch(error){
        res.status(500).json({
            ok: false,
            message: "Error desconocido",
            created: moment()
        })
    }
}


module.exports = {
    login,
    result,
}