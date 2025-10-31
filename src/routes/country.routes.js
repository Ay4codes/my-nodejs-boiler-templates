import express from 'express';
import CounrtyCtrl from '../controllers/counrtyCtrl.js';
import Auth from '../middleware/auth.middleware.js';

const router = express.Router()

router.get('/', Auth.apiGuard, CounrtyCtrl.getCountries)

export default router;