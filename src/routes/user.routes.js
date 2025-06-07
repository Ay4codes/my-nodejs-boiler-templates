import express from "express";
import userCtrl from "../controllers/userCtrl.js";
import Auth from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/', Auth.authGuard, Auth.checkPrivilege('create_user'), userCtrl.createUser)

router.put('/onboard', Auth.authGuard, Auth.checkPrivilege('onboard_user'), userCtrl.onboardUser)

router.get('/all', Auth.authGuard, Auth.checkPrivilege('view_user'), userCtrl.getAllUser)

router.get('/current', Auth.authGuard, Auth.checkPrivilege('view_user'), userCtrl.getCurrentUser)

router.put('/update', Auth.authGuard, Auth.checkPrivilege('update_user'), userCtrl.updateUser)

router.put('/change-password', Auth.authGuard, Auth.checkPrivilege('change_password'), userCtrl.changePassword)

export default router;