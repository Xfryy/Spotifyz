import { RecentlyPlayed } from "../models/recentlyPlayed.model.js";

export const getRecentlyPlayed = async (req, res, next) => {
  try {
    const recentlyPlayed = await RecentlyPlayed.find({ 
      userId: req.auth.userId 
    })
    .sort({ playedAt: -1 })
    .limit(20)
    .populate('songId');

    // Extract just the songs and remove duplicates
    const songs = [...new Map(
      recentlyPlayed
        .map(item => item.songId)
        .filter(Boolean)
        .map(song => [song._id.toString(), song])
    ).values()];

    res.json(songs.slice(0, 10)); // Return max 10 unique songs
  } catch (error) {
    next(error);
  }
};

export const addRecentlyPlayed = async (songId, userId) => {
  try {
    await RecentlyPlayed.create({
      userId,
      songId
    });

    // Cleanup - keep only last 50 entries per user
    const oldEntries = await RecentlyPlayed.find({ userId })
      .sort({ playedAt: -1 })
      .skip(50);
      
    if (oldEntries.length > 0) {
      await RecentlyPlayed.deleteMany({
        userId,
        _id: { $in: oldEntries.map(e => e._id) }
      });
    }
  } catch (error) {
    console.error('Error adding recently played:', error);
  }
};
