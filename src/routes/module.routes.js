import express from 'express';
import Auth from '../middleware/auth.middleware.js'
import ModuleCtrl from '../controllers/moduleCtrl.js';

const router = express.Router()

router.get('/all', Auth.authGuard, Auth.checkPrivilege('VIEW_MODULE'), ModuleCtrl.getAllModules)

router.get('/list', Auth.authGuard, ModuleCtrl.getAllModulesList)

router.put('/', Auth.authGuard, Auth.checkPrivilege('UPDATE_MODULE'), ModuleCtrl.updateModule)

router.get('/', Auth.authGuard, Auth.checkPrivilege('VIEW_MODULE'), ModuleCtrl.getModule)

export default router;