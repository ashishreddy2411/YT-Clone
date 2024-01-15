import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/likes.models.js"
import {ApiError} from "../utils/ApiErrors.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.models.js"
import {Comment} from "../models/comments.models.js"
import {Tweet} from "../models/tweets.models.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }
    const userId = req.user._id
    const like = await Like.findOne({video: videoId, likedBy: userId})
    if(like) {
        await Like.findByIdAndDelete(like._id)
        res.status(200).json(new ApiResponse(200, "Like removed"))
    }
    else {
        await Like.create({video: videoId, likedBy: userId})
        res.status(201).json(new ApiResponse(201, "Liked the video"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user._id
    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }
    const comment = await Comment.findById(commentId)
    if(!comment) {
        throw new ApiError(404, "Comment not found")
    }
    const like = await Like.findOne({comment: commentId, likedBy: userId})
    if(like) {
        await Like.findByIdAndDelete(like._id)
        res.status(200).json(new ApiResponse(200, "Like removed"))
    }
    else {
        await Like.create({comment: commentId, likedBy: userId})
        res.status(201).json(new ApiResponse(201, "Liked the comment"))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user._id
    if(!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
    const like = await Like.findOne({tweet: tweetId, likedBy: userId})
    if(like) {
        await Like.findByIdAndDelete(like._id)
        res.status(200).json(new ApiResponse(200, "Like removed"))
    }
    else {
        await Like.create({tweet: tweetId, likedBy: userId})
        res.status(201).json(new ApiResponse(201, "Liked the tweet"))
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const videos = await Like.find({likedBy: userId}).populate("video")
    if(!videos) {
        res.status(200).json(new ApiResponse(200, "No Liked Videos", []))
    }
    res.status(200).json(new ApiResponse(200, "Liked videos", videos))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}