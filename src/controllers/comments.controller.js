import mongoose,{isValidObjectId} from "mongoose"
import asyncHandler from "../middlewares/asyncHandler.js"
import { Video } from "../models/video.models.js"
import { Comment } from "../models/comments.models.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }
    const comments = await Comment.aggregatePaginate(Comment.find({video: videoId}), {page, limit})
    if(!comments) {
        res.status(200).json(new ApiResponse(200, "No Comments Found", []))
    }
    else {
        res.status(200).json(new ApiResponse(200, "Comments Found", comments))
    }
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {comment} = req.body
    if(!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video) {
        throw new ApiError(404, "Video not found")
    }
    const newComment = await Comment.create({
        video: videoId,
        content: comment,
        owner: req.user._id
    })
    res.status(201).json(new ApiResponse(201, "Comment Added", newComment))
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const {comment} = req.body
    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }
    const commentToUpdate = await Comment.findById(commentId)
    if(!commentToUpdate) {
        throw new ApiError(404, "Comment not found")
    }
    if(commentToUpdate.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this comment")
    }
    const updatecom=await Comment.findByIdAndUpdate(commentId, {content: comment}, {new: true})
    res.status(200).json(new ApiResponse(200, "Comment Updated", updatecom))
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment id")
    }
    const commentToDelete = await Comment.findById(commentId)
    if(!commentToDelete) {
        throw new ApiError(404, "Comment not found")
    }
    if(commentToDelete.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this comment")
    }
    await Comment.findByIdAndDelete(commentId)
    res.status(200).json(new ApiResponse(200, "Comment Deleted"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }