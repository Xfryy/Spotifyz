import mongoose from "mongoose";

const recentlyPlayedSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  playedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries and automatic removal of old entries
recentlyPlayedSchema.index({ userId: 1, playedAt: -1 });

export const RecentlyPlayed = mongoose.model('RecentlyPlayed', recentlyPlayedSchema);
