import express from 'express';
import EnumCtrl from '../controllers/enumCtrl.js';

const router = express.Router()

router.get('/', EnumCtrl.getEnums)

export default router;