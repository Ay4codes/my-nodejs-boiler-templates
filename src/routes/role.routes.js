import express from 'express';
import Auth from '../middleware/auth.middleware.js'
import RoleCtrl from '../controllers/roleCtrl.js';

const router = express.Router()

router.get('/all', Auth.authGuard, Auth.checkPrivilege('VIEW_ROLE'), RoleCtrl.getAllRoles)

router.get('/list', Auth.authGuard, RoleCtrl.getAllRolesList)

router.get('/member', Auth.authGuard, Auth.checkPrivilege('VIEW_ROLE_MEMBER'), RoleCtrl.getMembers)

router.post('/', Auth.authGuard, Auth.checkPrivilege('CREATE_ROLE'), RoleCtrl.createRole)

router.put('/', Auth.authGuard, Auth.checkPrivilege('UPDATE_ROLE'), RoleCtrl.updateRole)

router.get('/', Auth.authGuard, Auth.checkPrivilege('VIEW_ROLE'), RoleCtrl.getRole)

router.post('/assign', Auth.authGuard, Auth.checkPrivilege('ASSIGN_ROLE'), RoleCtrl.assignRoleToUser)

router.post('/remove', Auth.authGuard, Auth.checkPrivilege('REMOVE_ROLE'), RoleCtrl.removeRoleFromUser)

router.get('/history', Auth.authGuard, Auth.checkPrivilege('VIEW_ROLE_HISTORY'), RoleCtrl.getRoleHistory)

router.delete('/', Auth.authGuard, Auth.checkPrivilege('DELETE_ROLE'), RoleCtrl.deleteRole)

export default router;