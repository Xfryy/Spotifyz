import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find().populate('songs');
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id)
      .populate({
        path: 'songs',
        select: '_id title artist imageUrl audioUrl duration createdAt'
      });

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json(album);
  } catch (error) {
    next(error);
  }
};

export const getTopAlbums = async (req, res, next) => {
  try {
    // In a real application, you would query based on play counts or other engagement metrics
    // For now, we'll just get 4 random albums as a placeholder
    const topAlbums = await Album.aggregate([
      { $sample: { size: 4 } },
      {
        $lookup: {
          from: "songs",
          localField: "_id",
          foreignField: "albumId",
          as: "songs"
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          releaseYear: 1,
          songsCount: { $size: "$songs" }
        }
      }
    ]);

    res.status(200).json(topAlbums);
  } catch (error) {
    next(error);
  }
};