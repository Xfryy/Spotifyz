import { clerkClient } from "@clerk/express";
import { Playlist } from "../models/playlist.model.js";

export const protectRoute = async (req, res, next) => {
  if (!req.auth?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (error) {
    next(error);
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
