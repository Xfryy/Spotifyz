import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Artist",
            required: true,
        },
        artist: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        audioUrl: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        albumId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Album",
            required: false,
        },
        plays: {
            type: Number,
            default: 0,
        },
        playHistory: [
            {
                playedAt: {
                    type: Date,
                    default: Date.now,
                },
                count: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Create text index for search
songSchema.index({ title: "text", artist: "text" });

export const Song = mongoose.model("Song", songSchema);
