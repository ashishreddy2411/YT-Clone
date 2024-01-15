import { Router } from "express";
import {    toggleSubscription,getUserChannelSubscribers,getSubscribedChannels} from "../controllers/subscription.controller.js";
import { verifyUser } from '../middlewares/auth.js';

const router = Router();

router.route("/toggleSubscription/:channelId").post(verifyUser,toggleSubscription);
router.route("/getUserChannelSubscribers").get(verifyUser,getUserChannelSubscribers);
router.route("/getSubscribedChannels").get(verifyUser,getSubscribedChannels);

export default router;

