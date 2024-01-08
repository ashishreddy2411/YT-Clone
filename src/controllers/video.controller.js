import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiErrors.js"
import {Video} from "../models/video.model.js";
import {uploadFile} from "../utils/FileUpload.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken";


const uploadVideo=asyncHandler(async(req,res,next)=>{
    console.log(req.file);
    console.log(req.body);
    const {title,description}=req.body;
    const {file}=req;
    const {id}=req.user;
    console.log(req.user);
    console.log(title,description,file,id);
    const videoUp=await uploadFile(file);
    if(!videoUp){
        return next(new ApiError(500,"Error uploading video"));
    }
    console.log(videoUp);
    // const video=await Video.create({
    //     videofile:filename,
    //     thumbnail,
    //     title,
    //     description,
    //     owner:id,
    //     duration:0
    // });
    // return new ApiResponse(res).send({
    //     message:"Video uploaded successfully",
    //     data:video
    // });
});

export {uploadVideo};
