const { Router } = require('express');
const router = Router();

const {
    login,
    result,
    getJWT,
    saveToken,
} = require('../controllers/authController');


router.get('/login', login);
router.get('/result', result);
router.get('/getjwt', getJWT);
router.post('/savetoken', saveToken);

module.exports = router;