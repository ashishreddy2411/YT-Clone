import express from 'express';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.models.js";
import {uploadFile} from "../utils/FileUpload.js";
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser= asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;
    if ([username, fullname, email, password].some((arg) => arg === ""))
        {
            throw new ApiError(400, "Please fill all the fields");
        }
    const userExists = await User.findOne({ username });
    if(userExists){
        throw new ApiError(409, "User already exists");
    }
    const lavatarPath=req.files?.avatar[0]?.path;
    const lcoverImagePath=req.files?.coverImage[0]?.path;


    var avatar=null;
    var coverImage=null;
    if(lavatarPath)
        {
            avatar=await uploadFile(lavatarPath);
        }
    if(lcoverImagePath)
        {
            coverImage=await uploadFile(lcoverImagePath);
        }
    const user = await User.create({
        username,
        fullname,
        email,
        password,
        avatar:avatar.url||null,
        coverImage:coverImage.url||null,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "User not created");
    }

    return res.status(201).json(new ApiResponse(200, "User created successfully", createdUser));
});

export { registerUser}