import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "/playlists/default.jpg",
    },
    owner: {
      type: String, // Clerk user ID
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    songs: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    }],
    isPublic: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
