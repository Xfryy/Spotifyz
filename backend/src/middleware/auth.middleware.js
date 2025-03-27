import { clerkClient } from "@clerk/express";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ clerkId: req.auth.userId });
    
    if (!user) {
      console.log('Admin check failed: User not found', req.auth.userId);
      return res.status(403).json({ 
        message: "Unauthorized: User not found",
        error: "NO_USER"
      });
    }

    if (!user.isAdmin) {
      console.log('Admin check failed: Not an admin', user.clerkId);
      return res.status(403).json({ 
        message: "Unauthorized: Not an admin",
        error: "NOT_ADMIN"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: "SERVER_ERROR"
    });
  }
};

// New middleware for playlist ownership
export const checkPlaylistOwnership = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    if (playlist.owner !== req.auth.userId) {
      return res.status(403).json({ message: "You don't own this playlist" });
    }
    req.playlist = playlist;
    next();
  } catch (error) {
    next(error);
  }
};
