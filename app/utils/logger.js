const { createLogger, format, transports } = require('winston');


/**
 * 
 * Creación de Logs del sistema
 *
 */
module.exports = createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
    ),
    transports: [
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../logs/logs.log`
        }),
        new transports.Console({
            level: 'debug',
        })
    ]
});