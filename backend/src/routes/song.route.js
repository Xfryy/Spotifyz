import { Router } from "express";
import {
  getAllSongs,
  getFeaturedSongs, 
  getMadeForYouSongs,
  getTrendingSongs,
  searchSongs,
  incrementPlay
} from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/search", searchSongs);

// Protected routes (need authentication)
router.use(protectRoute);
router.get("/", getAllSongs); // Remove requireAdmin, all users can access songs
router.post("/play", incrementPlay);

export default router;