import express from 'express';
import CounrtyCtrl from '../controllers/counrtyCtrl.js';

const router = express.Router()

router.get('/', CounrtyCtrl.getCountries)

export default router;