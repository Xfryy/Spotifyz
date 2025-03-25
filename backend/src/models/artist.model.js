import mongoose from "mongoose";

const artistSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            default: ""
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual populate for getting all songs by this artist
artistSchema.virtual('songs', {
    ref: 'Song',
    localField: '_id',
    foreignField: 'artistId'
});

// Virtual populate for getting all albums by this artist
artistSchema.virtual('albums', {
    ref: 'Album',
    localField: '_id',
    foreignField: 'artistId'
});

export const Artist = mongoose.model("Artist", artistSchema);
