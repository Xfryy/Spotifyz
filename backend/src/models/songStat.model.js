import mongoose from "mongoose";

const songStatSchema = new mongoose.Schema({
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  playCount: {
    type: Number,
    default: 0
  },
  playedAt: {
    type: Date,
    required: true
  }
});

export default mongoose.model("SongStat", songStatSchema);
