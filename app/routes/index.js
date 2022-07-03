const { Router } = require('express');
const express = require('express');
const auth = require('./authRoutes')
const classroom = require('./classroomRoutes')
const init = require('../database/init')


const app = express();
const router = Router();

router.get('/init', init)


app.use('/v1', router);
app.use('/v1/authentication', auth);
app.use('/v1/classroom', classroom);


module.exports = app;