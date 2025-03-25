import { Artist } from "../models/artist.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllArtists = async (req, res, next) => {
    try {
        const artists = await Artist.find()
            .populate({
                path: 'songs',
                select: 'title plays'
            });
        res.json(artists);
    } catch (error) {
        next(error);
    }
};

export const createArtist = async (req, res, next) => {
    try {
        const { fullName, bio } = req.body;
        
        if (!req.files?.image) {
            return res.status(400).json({ message: "Please upload artist image" });
        }

        const file = req.files.image;
        
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'artists',
            resource_type: 'image'
        });
        
        const artist = await Artist.create({
            fullName,
            bio,
            imageUrl: result.secure_url
        });

        res.status(201).json(artist);
    } catch (error) {
        console.error('Create artist error:', error);
        next(error);
    }
};

export const deleteArtist = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Check if artist has songs or albums
        const songsCount = await Song.countDocuments({ artistId: id });
        const albumsCount = await Album.countDocuments({ artistId: id });
        
        if (songsCount > 0 || albumsCount > 0) {
            return res.status(400).json({ 
                message: "Cannot delete artist with existing songs or albums" 
            });
        }

        const artist = await Artist.findById(id);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        // Delete artist image from cloudinary
        if (artist.imageUrl) {
            const publicId = artist.imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Artist.findByIdAndDelete(id);
        res.json({ message: "Artist deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const getArtistStats = async (req, res, next) => {
    try {
        const artists = await Artist.aggregate([
            {
                $lookup: {
                    from: 'songs',
                    localField: '_id',
                    foreignField: 'artistId',
                    as: 'songs'
                }
            },
            {
                $lookup: {
                    from: 'albums',
                    localField: '_id',
                    foreignField: 'artistId',
                    as: 'albums'
                }
            },
            {
                $project: {
                    fullName: 1,
                    imageUrl: 1,
                    totalSongs: { $size: '$songs' },
                    totalAlbums: { $size: '$albums' },
                    totalPlays: { $sum: '$songs.plays' }
                }
            }
        ]);
        
        res.json(artists);
    } catch (error) {
        next(error);
    }
};
