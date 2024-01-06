import {Router} from 'express';
import { registerUser,loginUser, logoutUser,refreshAccessToken ,changePassword,updateAccountDetails,channelsSubcribed} from '../controllers/user.controller.js';
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

router.route("/updateProfile").post(verifyUser,updateAccountDetails);

router.route("/getChannels").post(verifyUser,channelsSubcribed);

export default router;