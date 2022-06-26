const { Router } = require('express');
const express = require('express');
const auth = require('./authRoutes')
const classroom = require('./clasroomRoutes')


const app = express();
const router = Router();

app.use('/v1', router);
app.use('/v1/authentication', auth);
app.use('/v1/classroom', classroom);

module.exports = app;