import express from "express";
import userCtrl from "../controllers/userCtrl.js";
import Auth from '../middleware/auth.middleware.js'

const router = express.Router();

router.get('/get-user', Auth.authGuard, userCtrl.getUser)

router.post('/update-user', Auth.authGuard, userCtrl.updateUser)

router.post('/change-password', Auth.authGuard, userCtrl.changePassword)

export default router;