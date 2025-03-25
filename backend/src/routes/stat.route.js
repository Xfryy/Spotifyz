import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getStats } from "../controller/stat.controller.js";
import { getSongStats } from "../controller/songStat.controller.js";

const router = Router();

// GET /api/stats         // Mendapatkan statistik (total songs, albums, users, dll)
router.get("/", protectRoute, requireAdmin, getStats);
router.get("/song-plays", getSongStats);

export default router;
