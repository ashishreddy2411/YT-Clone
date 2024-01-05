
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiErrors.js"
import {User} from "../models/user.models.js";
import {uploadFile} from "../utils/FileUpload.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken";

const registerUser= asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body;
    if ([username, fullname, email, password].some((arg) => arg === ""))
        {
            throw new ApiError(400, "Please fill all the fields");
        }
    const userExists = await User.findOne({ username });
    if(userExists!=null){
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

const loginUser=  asyncHandler(async (req, res) => {
    const { username,email, password } = req.body;

    if ([username,email, password].some((arg) => arg === ""))
        {
            throw new ApiError(400, "Please fill all the fields");
        }
    if(!username && !email){
        throw new ApiError(400, "Please provide username or email");
    }
    const userExists= await User.findOne({
        $or: [
            {username},
            {email}
        ]
    });
    if(!userExists){
        throw new ApiError(404, "User not found");
    }else{
        const passwordMatch=await userExists.isPasswordMatch(password);
        if(passwordMatch){
            try{

                //remove password and refresh token from user object
                const accessToken=await userExists.generateAccessToken();
                const refreshToken=await userExists.generateRefreshToken();
                userExists.refreshToken=refreshToken;
                await userExists.save({validateBeforeSave: false});
                const options={
                    httpOnly: true,
                    secure:true,
                };
                return res.status(200).cookie("refreshToken", refreshToken,options).cookie("accessToken", accessToken,options).json(new ApiResponse(200, "User logged in successfully", userExists));
            }catch(error)
                {
                    throw new ApiError(500, "Error while generating tokens");
                }
        }else{
            throw new ApiError(401, "Wrong Password! Please try again");
        }
    }
});

const logoutUser= asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null,
            },
        },
        { new: true }
    );
    const options={
        httpOnly: true,
        secure:true,
    };
    return res.status(200).cookie("refreshToken", null,options).cookie("accessToken", null).json(new ApiResponse(200, "User logged out successfully", null));
});

const refreshAccessToken= asyncHandler(async (req, res) => {
    try {
        const reqToken=req.cookies.refreshToken || req.body.refreshToken;
        if(!reqToken){
            throw new ApiError(401, "Unauthorized request");
        }
        const decoded=jwt.verify(reqToken,process.env.Refresh_Token_Secret);
        if(!decoded){
            throw new ApiError(401, "Invalid token from JWT");
        }
        const user=await User.findById(decoded._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(404, "User not found");
        }
        if(user.refreshToken!==reqToken){
            throw new ApiError(401, "Refresh token not matched");
        }
        const accessToken=await user.generateAccessToken();
        const refreshToken=await user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave: false});
        const options={
            httpOnly: true,
            secure:true,
        };
        return res.status(200).cookie("refreshToken", refreshToken,options).cookie("accessToken", accessToken,options).json(new ApiResponse(200, "Access token refreshed successfully", user));
    
    } catch (error) {
        throw new ApiError(401, "Invalid Token from catch");
    }});

export { registerUser,loginUser ,logoutUser,refreshAccessToken}