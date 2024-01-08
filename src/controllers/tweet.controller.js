import mongoose from "mongoose";
import { Tweet } from "../models/tweets.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async (req, res, next) => {
    const { content } = req.body;
    const {user} = req;
    if (!content) {
        return next(new ApiError(400, "Content is required"));
    }
    const tweet = await Tweet.create(
        { 
            content,
            owner: user
        }
    );
    if (!tweet) {
        return next(new ApiError(500, "Something went wrong"));
    }
    return res.status(201).json(new ApiResponse(201, "Tweet created successfully", tweet));
});

const getUserTweets = asyncHandler(async (req, res, next) => {
    const {user} = req;
    const tweets = await Tweet.find({owner: user});
    if (!tweets) {
        return next(new ApiError(500, "Something went wrong"));
    }
    return res.status(200).json(new ApiResponse(200, "Tweets fetched successfully", tweets));
});

const updateTweet = asyncHandler(async (req, res, next) => {
    const { content } = req.body;
    const { id } = req.params;
    const {user} = req;
    if (!content) {
        return next(new ApiError(400, "Content is required"));
    }
    const tweet = await Tweet.findOneAndUpdate({_id: id, owner: user}, {content}, {new: true});
    if (!tweet) {
        return next(new ApiError(500, "Something went wrong"));
    }
    return res.status(200).json(new ApiResponse(200, "Tweet updated successfully", tweet));
});

const deleteTweet = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const {user} = req;
    const tweet = await Tweet.findOneAndDelete({_id: id, owner: user});
    if (!tweet) {
        return next(new ApiError(500, "Something went wrong"));
    }
    return res.status(200).json(new ApiResponse(200, "Tweet deleted successfully", tweet));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet};