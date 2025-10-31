import express from 'express';
import AuthCtrl from '../controllers/authCtrl.js';
import Auth from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', Auth.apiGuard, AuthCtrl.registerUser)

router.post('/login', Auth.apiGuard, AuthCtrl.loginUser)

router.get('/logout', Auth.apiGuard, AuthCtrl.logoutUser)

router.get('/refresh-token', Auth.apiGuard, Auth.authGuard, AuthCtrl.refreshToken)

router.put('/verify-email', Auth.apiGuard, AuthCtrl.verifyEmail)

router.post('/request-password-reset', Auth.apiGuard, AuthCtrl.requestPasswordReset)

router.put('/reset-password', Auth.apiGuard, AuthCtrl.resetPassword)

export default router;