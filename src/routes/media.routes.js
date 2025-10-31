import express from 'express';
import Auth from '../middleware/auth.middleware.js'
import MediaServices from '../services/media.services.js';
import MediaCtrl from '../controllers/mediaCtrl.js';

const router = express.Router()

router.post("/file", Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('UPLOAD_MEDIA'), MediaServices.upload.single("file"), MediaServices.uploadMedia.bind(MediaServices));

router.post("/files", Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('UPLOAD_MEDIA'), MediaServices.upload.array("files", 5), MediaServices.uploadMultipleMedia.bind(MediaServices));

router.get('/all', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_MEDIA'), MediaCtrl.getAllMedia)

router.get('/list', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_MEDIA'), MediaCtrl.getAllMediaList)

router.get('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('VIEW_MEDIA'), MediaCtrl.getMedia)

router.put('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('UPDATE_MEDIA'), MediaCtrl.updateMedia)

router.delete('/', Auth.apiGuard, Auth.authGuard, Auth.checkPrivilege('DELETE_MEDIA'), MediaCtrl.deleteMedia)

router.get('/download', MediaServices.downloadMedia)

export default router;