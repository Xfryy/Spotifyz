import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";
import { Playlist } from "../models/playlist.model.js"; // Tambah ini
import path from 'path';
import fs from 'fs/promises';

const BACKEND_URL = process.env.NODE_ENV === 'production' ? process.env.BACKEND_URL : 'http://localhost:5000';

export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find()
      .populate('albumId', 'title') // Populate album information
      .sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    // fetch 6 random songs using mongodb's aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    console.log("Featured songs:", songs);
    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);

    res.json(songs);
  } catch (error) {
    next(error);
  }
};

export const searchSongs = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query?.trim()) {
      return res.status(400).json({ 
        songs: [],
        albums: [],
        playlists: []
      });
    }

    const queryRegex = new RegExp(query, "i");

    // Search songs with all required fields
    const songs = await Song.find({
      $or: [
        { title: { $regex: queryRegex } },
        { artist: { $regex: queryRegex } },
      ],
    })
    .select('_id title artist imageUrl audioUrl duration albumId')
    .limit(10);

    // Search albums with all required fields
    const albums = await Album.find({
      $or: [
        { title: { $regex: queryRegex } },
        { artist: { $regex: queryRegex } },
      ],
    })
    .select('_id title artist imageUrl releaseYear')
    .limit(10);

    // Search playlists with all required fields and populated songs
    const playlists = await Playlist.find({
      $and: [
        { 
          $or: [
            { title: { $regex: queryRegex } },
            { description: { $regex: queryRegex } }
          ]
        },
        { isPublic: true }
      ]
    })
    .select('_id title description imageUrl ownerName')
    .populate({
      path: 'songs',
      select: '_id title artist imageUrl audioUrl duration'
    })
    .limit(10);

    res.json({
      songs,
      albums,
      playlists
    });
  } catch (error) {
    console.error('Search error:', error);
    next(error);
  }
};

export const downloadSong = async (req, res, next) => {
  try {
    const { songId } = req.params;
    
    if (!req.auth?.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify if user is Pro
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (!user.isPro) {
      return res.status(403).json({ message: "Pro subscription required to download songs" });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    try {
      let filePath;
      
      if (song.audioUrl.startsWith('http')) {
        // Handle Cloudinary URLs
        const response = await fetch(song.audioUrl);
        if (!response.ok) throw new Error('Failed to fetch from Cloudinary');
        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${song.title}.mp3"`);
        return res.send(Buffer.from(buffer));
      } else {
        // Handle local files
        filePath = path.join(process.cwd(), 'public', song.audioUrl);
        
        // Check if file exists
        await fs.access(filePath);
        
        // Stream the file
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${song.title}.mp3"`);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      }
    } catch (fetchError) {
      console.error("File access error:", fetchError);
      return res.status(500).json({ 
        message: "Could not access audio file",
        details: fetchError.message 
      });
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      message: "Failed to process download request",
      details: error.message 
    });
  }
};

// New function to increment play count
export const incrementPlay = async (req, res, next) => {
  try {
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ message: "songId is required" });
    }
    
    const updatedSong = await Song.findByIdAndUpdate(
      songId,
      {
        $inc: { plays: 1 },
        $push: {
          playHistory: {
            playedAt: new Date(),
            count: 1
          }
        }
      },
      { new: true }
    );

    if (!updatedSong) {
      return res.status(404).json({ message: "Song not found" });
    }
    
    res.status(200).json({ 
      message: "Play count updated", 
      plays: updatedSong.plays 
    });
  } catch (error) {
    next(error);
  }
};
