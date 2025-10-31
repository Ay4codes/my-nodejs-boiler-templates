import express from 'express';
import Auth from '../middleware/auth.middleware.js'
import RoleCtrl from '../controllers/roleCtrl.js';

const router = express.Router()

router.get('/all', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_ROLE'), RoleCtrl.getAllRoles)

router.get('/list', Auth.apiGuard, Auth.authGuard, RoleCtrl.getAllRolesList)

router.get('/member', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_ROLE_MEMBER'), RoleCtrl.getMembers)

router.post('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('CREATE_ROLE'), RoleCtrl.createRole)

router.put('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('UPDATE_ROLE'), RoleCtrl.updateRole)

router.get('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_ROLE'), RoleCtrl.getRole)

router.post('/assign', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('ASSIGN_ROLE'), RoleCtrl.assignRoleToUser)

router.post('/remove', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('REMOVE_ROLE'), RoleCtrl.removeRoleFromUser)

router.get('/history', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_ROLE_HISTORY'), RoleCtrl.getRoleHistory)

router.delete('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('DELETE_ROLE'), RoleCtrl.deleteRole)

export default router;