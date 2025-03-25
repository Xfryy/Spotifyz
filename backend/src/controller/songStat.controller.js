import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import SongStat from "../models/songStat.model.js";

export const trackSongPlay = async (songId) => {
  try {
    await Song.findByIdAndUpdate(songId, {
      $inc: { plays: 1 },
      $push: {
        playHistory: {
          playedAt: new Date(),
          count: 1
        }
      }
    });
  } catch (error) {
    console.error("Error tracking song play:", error);
  }
};

export const getSongStats = async (req, res) => {
  try {
    const { songId, period } = req.query;
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'year':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        return res.status(400).json({ message: "Invalid period" });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Hitung total plays dalam periode yang dipilih
    const periodPlays = song.playHistory
      .filter(play => play.playedAt >= startDate)
      .reduce((total, play) => total + play.count, 0);

    res.json({
      period,
      plays: periodPlays
    });
  } catch (error) {
    console.error("Error getting song stats:", error);
    res.status(500).json({ message: error.message });
  }
};
