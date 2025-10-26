import express from 'express';
import Auth from '../middleware/auth.middleware.js'
import MediaServices from '../services/media.services.js';
import MediaCtrl from '../controllers/mediaCtrl.js';

const router = express.Router()

router.post("/file", Auth.authGuard, Auth.checkPrivilege('UPLOAD_MEDIA'), MediaServices.upload.single("file"), MediaServices.uploadMedia.bind(MediaServices));

router.post("/files", Auth.authGuard, Auth.checkPrivilege('UPLOAD_MEDIA'), MediaServices.upload.array("files", 5), MediaServices.uploadMultipleMedia.bind(MediaServices));

router.get('/all', Auth.authGuard, Auth.checkPrivilege('VIEW_MEDIA'), MediaCtrl.getAllMedia)

router.get('/list', Auth.authGuard, Auth.checkPrivilege('VIEW_MEDIA'), MediaCtrl.getAllMediaList)

router.get('/', Auth.authGuard, Auth.checkPrivilege('VIEW_MEDIA'), MediaCtrl.getMedia)

export default router;