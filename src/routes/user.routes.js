import express from "express";
import userCtrl from "../controllers/userCtrl.js";
import Auth from '../middleware/auth.middleware.js'
import MediaServices from "../services/media.services.js";

const router = express.Router();

router.post('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('CREATE_ROLE'), userCtrl.createUser)

router.post('/onboard', Auth.apiGuard, userCtrl.onboardUser)

router.post('/resend-onboarding-link', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('RESEND_ONBOARDING_LINK'), userCtrl.resendOnboardingLink)

router.get('/all', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_USER'), userCtrl.getAllUser)

router.get('/list', Auth.apiGuard, Auth.authGuard, userCtrl.getAllUserList)

router.get('/staff/all', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_USER'), userCtrl.getAllStaffs)

router.get('/staff/list', Auth.apiGuard, Auth.authGuard, userCtrl.getAllStaffList)

router.get('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_USER'), userCtrl.getUser)

router.get('/current', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_USER'), userCtrl.getCurrentUser)

router.put('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('UPDATE_USERS'), userCtrl.updateUsers)

router.put('/current', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('UPDATE_USER'), userCtrl.updateUser)

router.post('/profile-image', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('UPDATE_USER'), MediaServices.upload.single("file"), userCtrl.uploadProfileImage)

router.put('/deactivate', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('DEACTIVATE_USER'), userCtrl.deactivateUser)

router.put('/reactivate', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('REACTIVATE_USER'), userCtrl.reactivateUser)

router.put('/change-password', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('CHANGE_PASSWORD'), userCtrl.changePassword)

router.post('/contact', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('CONTACT_USER'), MediaServices.uploadInMemory.single("file"), userCtrl.contactUser)

export default router;