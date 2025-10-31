import express from 'express';
import Auth from '../middleware/auth.middleware.js'
import PrivilegeCtrl from '../controllers/privilegeCtrl.js';

const router = express.Router()

router.get('/all', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_PRIVILEGE'), PrivilegeCtrl.getAllPrivileges)

router.get('/list', Auth.apiGuard, Auth.authGuard, PrivilegeCtrl.getAllPrivilegesList)

router.put('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('UPDATE_PRIVILEGE'), PrivilegeCtrl.updatePrivilege)

router.get('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_PRIVILEGE'), PrivilegeCtrl.getPrivilege)

export default router;