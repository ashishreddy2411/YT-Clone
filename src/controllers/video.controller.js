import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiErrors.js"
import {Video} from "../models/video.model.js";
import {uploadFile} from "../utils/FileUpload.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken";


const publishVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const {user} = req;
    const {video} = req.files;
    const {thumbnail} = req.files;
    if (!video || !thumbnail) {
        throw new ApiError(400, "Video and thumbnail is required");
    }
    console.log(video[0].path, thumbnail[0].path);
    const videoObj = await uploadFile(video[0].path);
    const thumbnailObj = await uploadFile(thumbnail[0].path);
    console.log(videoObj, thumbnailObj);
    if (!videoObj || !thumbnailObj) {
        throw new ApiError(500, "Something went wrong while uploading to cloudinary");
    }
    const newVideo = await Video.create(
        {
            title,
            description,
            videofile:videoObj.url,
            thumbnail:thumbnailObj.url,
            owner: user,
            isPublished: true,
            duration: 6
        }
    );
    if (!newVideo) {
        throw new ApiError(500, "Something went wrong");
    }
    return res.status(201).json(new ApiResponse(201, "Video published successfully", newVideo));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(500, "Something went wrong");
    }
    return res.status(200).json(new ApiResponse(200, "Video fetched successfully", video));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const { title, description} = req.body;
    let thumbnail;
    if(req.files)
    {
        ({thumbnail} = req.files);
    }
    console.log(title,description,thumbnail);
    if (thumbnail && title && description) {
        throw new ApiError(400, "Title, description or thumbnail is required to update");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(500, "Something went wrong");
    }
    if (title) {
        video.title = title;
    }
    if (description) {
        video.description = description;
    }
    if (thumbnail) {
        const thumbnailObj = await uploadFile(thumbnail[0].path);
        if (!thumbnailObj) {
            throw new ApiError(500, "Something went wrong while uploading to cloudinary");
        }
        video.thumbnail = thumbnailObj.url;
    }
    const updatedVideo = await video.save();
    if (!updatedVideo) {
        throw new ApiError(500, "Something went wrong");
    }
    return res.status(200).json(new ApiResponse(200, "Video updated successfully", updatedVideo));

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }
    const video = await Video.findById(videoId, {owner: req.user._id});
    if (!video) {
        throw new ApiError(500, "You are not authorized to delete this video");
    }
    const flag=await video.deleteOne();
    console.log(flag);
    if (!flag.acknowledged) {
        throw new ApiError(500, "Something went wrong");
    }
    return res.status(200).json(new ApiResponse(200, "Video deleted successfully", null));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(400, "Video id is required");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(500, "Something went wrong");
    }
    video.isPublished = !video.isPublished;
    const updatedVideo = await video.save();
    if (!updatedVideo) {
        throw new ApiError(500, "Something went wrong");
    }
    return res.status(200).json(new ApiResponse(200, "Video updated successfully", updatedVideo));
})

export {publishVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus};
