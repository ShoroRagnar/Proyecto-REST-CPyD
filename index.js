const express = require('express');
const os = require('os');
const cors = require('cors');
const logger = require('./app/utils/logger');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, X-API-TOKEN, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, PATCH, DELETE', 'OPTIONS', 'HEAD');
    next();
});

app.use(require('./app/routes'));

app.listen(port, () => {
    logger.info(`\n\tHost: ${os.hostname()}\n\tSistema Operativo: ${os.type()}\n\tServidor: NodeJS ${process.version}\n\tServidor corriendo en el puerto ${port}`);
});