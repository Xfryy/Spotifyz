import { Router } from "express";
import { 
  createPlaylist,
  getPlaylistsByUser,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getPlaylistsByUserId,
  getPublicPlaylists
} from "../controller/playlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

// Public playlist routes
router.get("/public", getPublicPlaylists);
router.get("/user/:userId", getPlaylistsByUserId);
router.get("/me", getPlaylistsByUser);
router.get("/:id", getPlaylistById);
router.post("/", createPlaylist);

// Protected playlist routes
router.patch("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);
router.post("/:id/songs", addSongToPlaylist); // Remove checkPlaylistOwnership
router.delete("/:id/songs/:songId", removeSongFromPlaylist);

export default router;
  