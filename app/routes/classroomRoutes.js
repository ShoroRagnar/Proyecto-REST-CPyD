const { Router } = require('express');
const router = Router();
const auth = require('../middleware/auth');

const {
    getIn,
    getOut,
    attendances,
} = require('../controllers/classRoomController');


router.post('/getin', auth, getIn);
router.post('/getout', auth, getOut);
router.get('/attendances', auth, attendances);

module.exports = router;