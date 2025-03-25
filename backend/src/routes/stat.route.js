import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getStats } from "../controller/stat.controller.js";

const router = Router();

// GET /api/stats         // Mendapatkan statistik (total songs, albums, users, dll)
router.get("/", protectRoute, requireAdmin, getStats);

export default router;
