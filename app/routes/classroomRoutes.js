const { Router } = require('express');
const router = Router();

const {
    getIn,
    getOut,
    attendances,
} = require('../controllers/classRoomController');


router.post('/getin', getIn);
router.post('/getout', getOut);
router.get('/attendances', attendances);

module.exports = router;