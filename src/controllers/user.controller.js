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

    console.log("User: ", req.body);

    const lavatarPath=req.files?.avatar[0]?.path;
    const lcoverImagePath=req.files?.coverImage[0]?.path;

    if(lavatarPath)
        {
            const avatar=await uploadFile(lavatarPath);
        }
    if(lcoverImagePath)
        {
            const coverImage=await uploadFile(lcoverImagePath);
        }

    const user = await User.create({
        username:username.tolowercase(),
        fullname,
        email,
        password,
        avatar:avatar.url||null,
        coverImage:coverImage.url||null,
    });

    const createdUser = await user.findbyId(user._id).select("-password -refreshToken");
    console.log("Created User: ", createdUser);

    if(!createdUser){
        throw new ApiError(500, "User not created");
    }

    return res.status(201).json(new ApiResponse(200, "User created successfully", createdUser));
});


// {
//     "username":"ashishjaddu",
//     "fullname":"Ashish Reddy Jaddu",
//     "email":"ashishrocker0@gmail.com",
//     "password":"Reset@123"
// }

export { registerUser}