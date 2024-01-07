import {Router} from 'express';
import { registerUser,loginUser, logoutUser,refreshAccessToken ,changePassword,updateAccountDetails,channelsSubcribed,getWatchHistory, getCurrentUser ,updateAvatar, updateCoverImage} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.js';
import { verifyUser } from '../middlewares/auth.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        {name:'avatar',maxCount:1},
        {name:'coverImage',maxCount:1}
    ])
    ,registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyUser,logoutUser);

router.route("/refreshToken").post(refreshAccessToken);

router.route("/changePassword").post(verifyUser,changePassword);

router.route("/getCurrentUser").get(verifyUser,getCurrentUser);

router.route("/updateProfile").patch(verifyUser,updateAccountDetails);

router.route("/updateAvatar").patch(verifyUser,upload.single('avatar'),updateAvatar);

router.route("/updateCoverImage").patch(verifyUser,upload.single('coverImage'),updateCoverImage);

router.route("/getChannels").get(verifyUser,channelsSubcribed);

router.route("/getWatchHistory").get(verifyUser,getWatchHistory);

export default router;