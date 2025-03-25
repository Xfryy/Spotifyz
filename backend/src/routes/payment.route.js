import { Router } from "express";
import { createCheckoutSession, handleWebhook, checkProStatus } from "../controller/payment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Payment Endpoints
 * 
 * POST /api/payment/create-checkout-session   // Membuat sesi pembayaran Stripe
 * GET  /api/payment/check-pro                 // Mengecek status Pro user
 */

// Note: webhook route should be handled in index.js
router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.get("/check-pro", protectRoute, checkProStatus);

export default router;
