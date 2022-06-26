const { Router } = require('express');
const router = Router();

const {
    login,
    result,
} = require('../controllers/authController');


router.get('/login', login);
router.get('/result', result);

module.exports = router;