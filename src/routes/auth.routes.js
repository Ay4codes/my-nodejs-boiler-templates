import express from 'express';
import AuthCtrl from '../controllers/authCtrl.js';
import Auth from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', AuthCtrl.registerUser)

router.post('/login', AuthCtrl.loginUser)

router.get('/logout', AuthCtrl.logoutUser)

router.get('/refresh-token', Auth.authGuard, AuthCtrl.refreshToken)

router.put('/verify-email', AuthCtrl.verifyEmail)

router.post('/request-password-reset', AuthCtrl.requestPasswordReset)

router.put('/reset-password', AuthCtrl.resetPassword)

export default router;