import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema=new mongoose.Schema({
    videofile: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    description: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1000,
    },
    views: {
        type: Number,
        required: true,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    duration: {
        type: Number,
        required: true,
    },
}, {timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate);

export const Video=mongoose.model("Video", videoSchema);