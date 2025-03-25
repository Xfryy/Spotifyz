import { Router } from "express";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong, getSongStats } from "../controller/admin.controller.js";
import { getAllArtists, createArtist, deleteArtist, getArtistStats } from "../controller/artist.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, requireAdmin);

router.get("/check", checkAdmin); // Mengecek status admin

router.post("/songs", createSong); // Membuat lagu baru
router.delete("/songs/:id", deleteSong); // Menghapus lagu

router.get("/songs/stats", protectRoute, requireAdmin, getSongStats); // Menambahkan route untuk statistik lagu

router.post("/albums", createAlbum); // Membuat album baru
router.delete("/albums/:id", deleteAlbum); // Menghapus album

// Artist routes - move these after the middleware
router.use(protectRoute, requireAdmin);

router.get("/artists", getAllArtists);
router.post("/artists", createArtist);
router.delete("/artists/:id", deleteArtist);
router.get("/artists/stats", getArtistStats);

router.get("/check-user-pro/:userId", protectRoute, async (req, res) => {
    try {
        const user = await User.findOne({ clerkId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Log full user object for debugging
        console.log("User Pro Status Check:", {
            userId: user.clerkId,
            isPro: user.isPro,
            stripeCustomerId: user.stripeCustomerId,
            updatedAt: user.updatedAt
        });
        
        res.json({
            isPro: user.isPro,
            stripeCustomerId: user.stripeCustomerId,
            lastUpdated: user.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
