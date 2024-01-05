import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";

const verifyUser = asyncHandler(async (req, res,next) => {
try {
        const reqToken=req.cookies.accessToken || req.headers.authorization.replace("Bearer ","");
        if(!reqToken){
            throw new ApiError(401, "Please login before logging out");
        }
        const decoded=jwt.verify(reqToken,process.env.Access_Token_Secret);
        if(!decoded){
            throw new ApiError(401, "Invalid Token from middleware");
        }
        const user=await User.findById(decoded._id).select("-password -refreshToken");
        if(!user){
            throw new ApiError(404, "User not found");
        }
        req.user=user;
        next();
} catch (error) {
        throw new ApiError(401, "Invalid Token from middleware catch");
}
});

export {verifyUser};