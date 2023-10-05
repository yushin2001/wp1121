import {
  createSong,
  deleteSong,
  getSong,
  getSongs,
  updateSong,
} from "../controllers/songs";
import express from "express";

const router = express.Router();

// GET /api/songs
router.get("/", getSongs);
// GET /api/songs/:id
router.get("/:id", getSong);
// POST /api/songs
router.post("/", createSong);
// PUT /api/songs/:id
router.put("/:id", updateSong);
// DELETE /api/songs/:id
router.delete("/:id", deleteSong);

// export the router
export default router;