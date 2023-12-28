import e from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new mongoose.Schema({
    watchHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    }],
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
        trim: true,
        lowercase: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true,
        lowercase: true,
        format: "email",
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 100,
    },
    fullname: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        index: true,
    },
    avatar: {
        type: String,
        required: false,
    },
    coverImage: {
        type: String,
        required: false,
    },
    refreshToken: {
        type: String,
    },

}, {timestamps: true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    try{
        this.password=await bcrypt.hash(this.password, 10);
        next();
    }catch(error){
        next(error);
    }
});

userSchema.methods.isPasswordMatch=async function(password){
    try{
        return await bcrypt.compare(password, this.password);
    }catch(error){
        throw error;
    }
};

userSchema.methods.generateAccessToken=function(){
    const payload={
        _id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname,
    };
    const secret=process.env.Access_Token_Secret;
    const options={
        expiresIn: process.env.Acceess_Token_Expire,
    };
    return jwt.sign(payload, secret, options);
};
userSchema.methods.generateRefreshToken=function(){
    const payload={
        _id: this._id,
    };
    const secret=process.env.Refresh_Token_Secret;
    const options={
        expiresIn: process.env.Refresh_Token_Expire,
    };
    return jwt.sign(payload, secret, options);
};

export const User=mongoose.model("User", userSchema);

