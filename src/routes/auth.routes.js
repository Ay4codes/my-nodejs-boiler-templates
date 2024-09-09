import express from 'express';
import AuthCtrl from '../controllers/authCtrl.js';

const router = express.Router()

router.post('/register', AuthCtrl.registerUser)

router.post('/login', AuthCtrl.loginUser)

router.get('/logout', AuthCtrl.logoutUser)

router.get('/refresh-tokens', AuthCtrl.refreshToken)

router.post('/verify-email', AuthCtrl.verifyEmail)

router.post('/request-password-reset', AuthCtrl.requestPasswordReset)

router.post('/reset-password', AuthCtrl.resetPassword)

export default router;