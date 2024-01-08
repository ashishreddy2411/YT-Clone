import {Router} from 'express';
import { createTweet,getUserTweets,updateTweet, deleteTweet} from '../controllers/tweet.controller.js';
import { verifyUser } from '../middlewares/auth.js';

const router = Router();

router.route("/createTweet").post(verifyUser,createTweet);
router.route("/getUserTweets").get(verifyUser,getUserTweets);
router.route("/updateTweet/:id").patch(verifyUser,updateTweet);
router.route("/deleteTweet/:id").delete(verifyUser,deleteTweet);

export default router;