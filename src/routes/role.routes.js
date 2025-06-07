import express from 'express';
import Auth from '../middleware/auth.middleware.js'
import RoleCtrl from '../controllers/roleCtrl.js';

const router = express.Router()

router.get('/all', Auth.authGuard, Auth.checkPrivilege('view_role'), RoleCtrl.getAllRoles)

router.post('/', Auth.authGuard, Auth.checkPrivilege('create_role'), RoleCtrl.createRole)

router.put('/', Auth.authGuard, Auth.checkPrivilege('update_role'), RoleCtrl.updateRole)

router.get('/', Auth.authGuard, Auth.checkPrivilege('view_role'), RoleCtrl.getRole)

router.post('/assign', Auth.authGuard, Auth.checkPrivilege('assign_role'), RoleCtrl.assignRoleToUser)

router.post('/remove', Auth.authGuard, Auth.checkPrivilege('remove_role'), RoleCtrl.removeRoleFromUser)

router.get('/history', Auth.authGuard, Auth.checkPrivilege('view_role_history'), RoleCtrl.getRoleHistory)

router.delete('/', Auth.authGuard, Auth.checkPrivilege('delete_role'), RoleCtrl.deleteRole)

export default router;