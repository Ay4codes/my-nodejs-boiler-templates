import express from 'express';
import Auth from '../middleware/auth.middleware.js'
import PrivilegeCtrl from '../controllers/privilegeCtrl.js';

const router = express.Router()

router.get('/all', Auth.authGuard, Auth.checkPrivilege('view_privilege'), PrivilegeCtrl.getAllPrivileges)

router.put('/', Auth.authGuard, Auth.checkPrivilege('update_privilege'), PrivilegeCtrl.updatePrivilege)

router.get('/', Auth.authGuard, Auth.checkPrivilege('view_privilege'), PrivilegeCtrl.getPrivilege)

export default router;