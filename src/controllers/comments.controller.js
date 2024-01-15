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
    
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }