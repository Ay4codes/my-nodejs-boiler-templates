import express from 'express';
import EnumCtrl from '../controllers/enumCtrl.js';
import Auth from '../middleware/auth.middleware.js';

const router = express.Router()

router.get('/', Auth.apiGuard, EnumCtrl.getEnums)

export default router;