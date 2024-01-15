import { Router } from "express";
import { verifyUser } from '../middlewares/auth.js';
import {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
} from "../controllers/likes.controller.js";

const router = Router();

router.route("/toggleVideoLike/:videoId").post(verifyUser, toggleVideoLike);
router.route("/toggleCommentLike/:commentId").post(verifyUser, toggleCommentLike);
router.route("/toggleTweetLike/:tweetId").post(verifyUser, toggleTweetLike);
router.route("/getLikedVideos").get(verifyUser, getLikedVideos);

export default router;