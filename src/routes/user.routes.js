import express from "express";
import userCtrl from "../controllers/userCtrl.js";
import Auth from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/', Auth.authGuard, Auth.checkPrivilege('CREATE_ROLE'), userCtrl.createUser)

router.post('/onboard', userCtrl.onboardUser)

router.post('/resend-onboarding-link', Auth.authGuard, Auth.checkPrivilege('RESEND_ONBOARDING_LINK'), userCtrl.resendOnboardingLink)

router.get('/all', Auth.authGuard, Auth.checkPrivilege('VIEW_USER'), userCtrl.getAllUser)

router.get('/list', Auth.authGuard, userCtrl.getAllUserList)

router.get('/staff/all', Auth.authGuard, Auth.checkPrivilege('VIEW_USER'), userCtrl.getAllStaffs)

router.get('/staff/list', Auth.authGuard, userCtrl.getAllStaffList)

router.get('/', Auth.authGuard, Auth.checkPrivilege('VIEW_USER'), userCtrl.getUser)

router.get('/current', Auth.authGuard, Auth.checkPrivilege('VIEW_USER'), userCtrl.getCurrentUser)

router.put('/', Auth.authGuard, Auth.checkPrivilege('UPDATE_USERS'), userCtrl.updateUsers)

router.put('/current', Auth.authGuard, Auth.checkPrivilege('UPDATE_USER'), userCtrl.updateUser)

router.put('/deactivate', Auth.authGuard, Auth.checkPrivilege('DEACTIVATE_USER'), userCtrl.deactivateUser)

router.put('/reactivate', Auth.authGuard, Auth.checkPrivilege('REACTIVATE_USER'), userCtrl.reactivateUser)

router.put('/change-password', Auth.authGuard, Auth.checkPrivilege('CHANGE_PASSWORD'), userCtrl.changePassword)

export default router;