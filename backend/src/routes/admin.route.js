import { Router } from "express";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong, getSongStats } from "../controller/admin.controller.js";
import { getAllArtists, createArtist, deleteArtist, getArtistStats } from "../controller/artist.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { User } from "../models/user.model.js";

const router = Router();

// Auth check endpoint - only needs protection
router.get("/check", protectRoute, checkAdmin);

// All other routes need both protection and admin status
router.use(protectRoute, requireAdmin);

// Song routes
router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);
router.get("/songs/stats", getSongStats);

// Album routes
router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

// Artist routes
router.get("/artists", getAllArtists);
router.post("/artists", createArtist);
router.delete("/artists/:id", deleteArtist);
router.get("/artists/stats", getArtistStats);

// User pro status check
router.get("/check-user-pro/:userId", async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        console.log("Pro status check for user:", {
            userId: user.clerkId,
            isPro: user.isPro,
            updatedAt: user.updatedAt
        });
        
        res.json({
            isPro: user.isPro,
            lastUpdated: user.updatedAt
        });
    } catch (error) {
        console.error("Pro status check error:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
