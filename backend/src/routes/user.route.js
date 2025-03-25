import { Router } from "express";
import { getAllUsers, getMessages, getUserByClerkId } from "../controller/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.get("/", getAllUsers);
router.get("/messages/:userId", getMessages);
router.get("/byClerkId/:clerkId", getUserByClerkId);

export default router;
