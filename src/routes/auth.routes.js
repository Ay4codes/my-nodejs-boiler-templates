const authCtrl = require("../controllers/authCtrl");

const router = require("express").Router();

router.post('/register', authCtrl.registerUser)

router.post('/login', authCtrl.loginUser)

router.get('/logout', authCtrl.logoutUser)

module.exports = router;