import mongoose from "mongoose";
import { config } from "dotenv";
import cloudinary from "../lib/cloudinary.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

config();

// Helper function to get public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\./);
    return matches && matches[1] ? matches[1].replace(/\.[^/.]+$/, "") : null;
  } catch (error) {
    return null;
  }
};

const resetDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get all songs and albums to delete from Cloudinary
    const songs = await Song.find();
    const albums = await Album.find();

    // Delete all files from Cloudinary
    console.log("Deleting files from Cloudinary...");
    
    // Delete song files
    for (const song of songs) {
      if (song.audioUrl) {
        const audioId = getPublicIdFromUrl(song.audioUrl);
        if (audioId) {
          await cloudinary.uploader.destroy(audioId, { resource_type: "video" });
        }
      }
      if (song.imageUrl) {
        const imageId = getPublicIdFromUrl(song.imageUrl);
        if (imageId) {
          await cloudinary.uploader.destroy(imageId);
        }
      }
    }

    // Delete album covers
    for (const album of albums) {
      if (album.imageUrl) {
        const imageId = getPublicIdFromUrl(album.imageUrl);
        if (imageId) {
          await cloudinary.uploader.destroy(imageId);
        }
      }
    }

    // Delete all records from MongoDB collections
    console.log("Deleting records from MongoDB...");
    await Promise.all([
      Song.deleteMany({}),
      Album.deleteMany({}),
      mongoose.connection.collection("messages").deleteMany({}),
    ]);

    console.log("Database reset completed successfully!");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

resetDatabase();
