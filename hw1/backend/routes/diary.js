import {
  createDiary,
  getDiaries,
  updateDiary,
  deleteDiary,
  getOneDiary,
} from "../controllers/diary.js";
import express from "express";

// Create an express router
const router = express.Router();

// Every path we define here will get /api/diaries prefix
// To make code even more cleaner we can wrap functions in `./controllers` folder

// GET /api/diaries
router.get("/", getDiaries);
// POST /api/diaries
router.post("/", createDiary);
// PUT /api/diaries/:id
router.put("/:id", updateDiary);
// DELETE /api/diaries/:id
router.delete("/:id", deleteDiary);
// GET /api/diaries/:id
router.get("/:id", getOneDiary);

// export the router
export default router;