import express from 'express';
import Auth from '../middleware/auth.middleware.js'
import PrivilegeCtrl from '../controllers/privilegeCtrl.js';

const router = express.Router()

router.get('/all', Auth.authGuard, Auth.checkPrivilege('VIEW_PRIVILEGE'), PrivilegeCtrl.getAllPrivileges)

router.get('/list', Auth.authGuard, PrivilegeCtrl.getAllPrivilegesList)

router.put('/', Auth.authGuard, Auth.checkPrivilege('UPDATE_PRIVILEGE'), PrivilegeCtrl.updatePrivilege)

router.get('/', Auth.authGuard, Auth.checkPrivilege('VIEW_PRIVILEGE'), PrivilegeCtrl.getPrivilege)

export default router;