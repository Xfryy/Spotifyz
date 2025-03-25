import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const createPlaylist = async (req, res, next) => {
  try {
    const { title, description, isPublic } = req.body;
    let imageUrl = "/playlists/default.jpg";

    // Get user data to get the owner's name
    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.files?.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath);
      imageUrl = result.secure_url;
    }

    const playlist = await Playlist.create({
      title,
      description,
      imageUrl,
      owner: req.auth.userId,
      ownerName: user.fullName,  // Add owner's name
      isPublic: isPublic ?? true
    });

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistsByUser = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ owner: req.auth.userId })
      .populate("songs")
      .sort("-createdAt");
    res.json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate("songs");
    
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Check if private playlist belongs to requesting user
    if (!playlist.isPublic && playlist.owner !== req.auth?.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const updatePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.owner !== req.auth.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, isPublic } = req.body;
    let imageUrl = playlist.imageUrl;

    if (req.files?.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath);
      imageUrl = result.secure_url;
    }

    Object.assign(playlist, {
      title: title ?? playlist.title,
      description: description ?? playlist.description,
      imageUrl,
      isPublic: isPublic ?? playlist.isPublic
    });

    await playlist.save();
    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.owner !== req.auth.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting playlist:", error);
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.owner !== req.auth.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if song already exists in playlist
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: "Song already in playlist" });
    }

    // Add song and return populated playlist
    playlist.songs.push(songId);
    await playlist.save();
    
    // Return populated playlist
    const populatedPlaylist = await Playlist.findById(playlist._id).populate("songs");
    res.json(populatedPlaylist);
  } catch (error) {
    console.error("Error adding song to playlist:", error);
    next(error);
  }
};

export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.owner !== req.auth.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
    await playlist.save();
    
    res.json(playlist);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params; // This is clerkId
    const playlists = await Playlist.find({ 
      owner: userId,
      isPublic: true 
    }).populate('songs');
    
    res.json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getPublicPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate("songs")
      .sort("-createdAt");
    res.json(playlists);
  } catch (error) {
    next(error);
  }
};
