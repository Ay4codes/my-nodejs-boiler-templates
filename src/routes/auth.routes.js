const AuthCtrl = require('../controllers/authCtrl');

const router = require("express").Router();

router.post('/register', AuthCtrl.registerUser)

router.post('/login', AuthCtrl.loginUser)

router.get('/logout', AuthCtrl.logoutUser)

router.get('/refresh-tokens', AuthCtrl.refreshToken)

module.exports = router;