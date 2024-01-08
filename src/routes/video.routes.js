import {Router} from 'express';
import { upload } from '../middlewares/multer.js';
import { verifyUser } from '../middlewares/auth.js';
import { publishVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus} from '../controllers/video.controller.js';

const router = Router();

router.route("/publishVideo").post(verifyUser,
    upload.fields([
        {name:'video',maxCount:1},
        {name:'thumbnail',maxCount:1}
    ])
,publishVideo);

router.route("/getVideoById/:videoId").get(getVideoById);
router.route("/updateVideo/:videoId").patch(verifyUser,updateVideo);
router.route("/togglePublishStatus/:videoId").patch(verifyUser,togglePublishStatus);
router.route("/deleteVideo/:videoId").delete(verifyUser,deleteVideo);


export default router;