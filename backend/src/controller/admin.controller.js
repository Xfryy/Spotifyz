import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { Artist } from "../models/artist.model.js";

// helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
	try {
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
		});
		return result.secure_url;
	} catch (error) {
		console.log("Error in uploadToCloudinary", error);
		throw new Error("Error uploading to cloudinary");
	}
};

// helper function to get public id from cloudinary url
const getPublicIdFromUrl = (url) => {
  try {
    // Extract the path between 'upload/' and last '/'
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)\./);
    if (matches && matches[1]) {
      // Remove any file extension and return the public ID
      return matches[1].replace(/\.[^/.]+$/, "");
    }
    return null;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

// helper function to delete file from cloudinary
const deleteFromCloudinary = async (url, resourceType = 'image') => {
  try {
    const publicId = getPublicIdFromUrl(url);
    if (publicId) {
      console.log(`Deleting from Cloudinary: ${publicId} (${resourceType})`);
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      console.log('Cloudinary delete result:', result);
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error; // Throw error so we know if deletion failed
  }
};

export const createSong = async (req, res, next) => {
    try {
        if (!req.files || !req.files.audioFile || !req.files.imageFile) {
            return res.status(400).json({ message: "Please upload all files" });
        }

        const { title, artistId, albumId, duration } = req.body;

        // Validate artist exists
        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const audioUrl = await uploadToCloudinary(req.files.audioFile);
        const imageUrl = await uploadToCloudinary(req.files.imageFile);

        const song = new Song({
            title,
            artistId,
            artist: artist.fullName, // Store artist name for quick access
            audioUrl,
            imageUrl,
            duration,
            albumId: albumId || null,
        });

        await song.save();

        if (albumId) {
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id },
            });
        }
        
        res.status(201).json(song);
    } catch (error) {
        console.log("Error in createSong", error);
        next(error);
    }
};

export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;
		const song = await Song.findById(id);

		if (!song) {
			return res.status(404).json({ message: "Song not found" });
		}

		// Delete files from Cloudinary
		await deleteFromCloudinary(song.audioUrl, 'video'); // audio files are handled as 'video' type in Cloudinary
		await deleteFromCloudinary(song.imageUrl);

		// if song belongs to an album, update the album's songs array
		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { songs: song._id },
			});
		}

		await Song.findByIdAndDelete(id);
		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		console.log("Error in deleteSong", error);
		next(error);
	}
};

export const createAlbum = async (req, res, next) => {
	try {
		const { title, artistId, releaseYear } = req.body;
		const { imageFile } = req.files;

		// Validate artist exists
		const artist = await Artist.findById(artistId);
		if (!artist) {
			return res.status(404).json({ message: "Artist not found" });
		}

		const imageUrl = await uploadToCloudinary(imageFile);

		const album = new Album({
			title,
			artistId,
			artist: artist.fullName, // Get artist name from database
			imageUrl,
			releaseYear,
			songs: []
		});

		await album.save();

		res.status(201).json(album);
	} catch (error) {
		console.log("Error in createAlbum", error);
		next(error);
	}
};

export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		
		// Get album and its songs
		const album = await Album.findById(id);
		if (!album) {
			return res.status(404).json({ message: "Album not found" });
		}

		// Delete album cover from Cloudinary
		await deleteFromCloudinary(album.imageUrl);

		// Get all songs in the album
		const songs = await Song.find({ albumId: id });

		// Delete each song and its files from Cloudinary
		for (const song of songs) {
			await deleteFromCloudinary(song.audioUrl, 'video');
			await deleteFromCloudinary(song.imageUrl);
		}

		// Delete all songs and the album from database
		await Song.deleteMany({ albumId: id });
		await Album.findByIdAndDelete(id);

		res.status(200).json({ message: "Album and all its songs deleted successfully" });
	} catch (error) {
		console.log("Error in deleteAlbum", error);
		next(error);
	}
};

import { config } from 'dotenv';
config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const checkAdmin = async (req, res) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({
        admin: false,
        message: "Authentication required"
      });
    }

    const user = await User.findOne({ clerkId: req.auth.userId });

    if (!user) {
      console.log('Admin check - User not found:', req.auth.userId);
      return res.status(404).json({
        admin: false,
        message: "User not found"
      });
    }

    const isAdmin = user.email === ADMIN_EMAIL;
    user.isAdmin = isAdmin;
    await user.save();

    console.log('Admin check result:', {
      userId: user.clerkId,
      isAdmin: isAdmin
    });

    res.json({
      admin: isAdmin,
      userId: user.clerkId
    });
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      admin: false,
      message: "Failed to check admin status",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getSongStats = async (req, res, next) => {
	try {
		// Include imageUrl along with title, artist and plays
		const songs = await Song.find().select("title artist plays imageUrl").lean();
		res.status(200).json(songs);
	} catch (error) {
		next(error);
	}
};
