const authCtrl = require("../controllers/authCtrl");

const router = require("express").Router();

router.post('/register', authCtrl.registerUser)

module.exports = router;