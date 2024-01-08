import {Router} from 'express';
import { upload } from '../middlewares/multer.js';
import { verifyUser } from '../middlewares/auth.js';
import { uploadVideo } from '../controllers/video.controller.js';

const router = Router();

router.route("/uploadVideo").post(verifyUser,upload.single('video'),uploadVideo);

export default router;