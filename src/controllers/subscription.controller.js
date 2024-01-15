import mongoose from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user._id
    if(!channelId)
        throw new ApiError(400,"Invalid request");
    const sub=await Subscription.findOne(
        {
            channel:{_id: channelId },
            subscriber: {_id: userId}
        });
    if(sub){
        await Subscription.deleteOne(
            {
                _id: sub._id
            });
        return res.status(200).json(new ApiResponse(200, "Unsubscribed successfully"));
    }
    await Subscription.create({
        channel: channelId,
        subscriber: userId
    });
    res.status(200).json(new ApiResponse(200, "Subscribed successfully"));
    
});

// controller to return list of subscribers of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const channelId = req.user._id
    if(!channelId)
        throw new ApiError(400,"Invalid request")
    const channel=await Subscription.aggregate([
        {
            $match: {channel: {_id:channelId}}
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber"
            }
        },
        {
            $unwind: "$subscriber"
        },
        {
            $project: {
                _id: 0,
                subscriber: {
                    _id: 1,
                    username: 1,
                }
            }
        }
    ])
    if(!channel)
        throw new ApiError(404,"Channel not found")
    console.log(channel)

});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const subscriberId = req.user._id
    if(!subscriberId)
        throw new ApiError(400,"Invalid request")
    const channels=await Subscription.aggregate([
        {
            $group: {
                "subscriber._id": subscriberId
        }
    }
])
    if(!channels)
        throw new ApiError(404,"Channel not found")
    console.log(channels)
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}