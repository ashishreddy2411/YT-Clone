import mongoose from "mongoose";


const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 32,
    },
    description: {
        type: String,
        trim: true,
        maxLength: 200,
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true });

playlistSchema.plugin(mongooseAggregatePaginate);


export const Playlist = mongoose.model("Playlist", playlistSchema);