const userCtrl = require("../controllers/userCtrl");
const Auth = require("../middleware/auth.middleware");

const router = require("express").Router();

router.get('/get-user', Auth.authGuard, userCtrl.getUser)

router.post('/update-user', Auth.authGuard, userCtrl.updateUser)

router.post('/change-password', Auth.authGuard, userCtrl.changePassword)

module.exports = router;