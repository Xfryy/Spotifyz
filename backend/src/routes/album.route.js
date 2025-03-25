import { Router } from "express";
import { getAlbumById, getAllAlbums } from "../controller/album.controller.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:id", getAlbumById); // Pastikan ini match dengan parameter di controller

export default router;
