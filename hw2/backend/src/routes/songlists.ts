import {
    createSongList,
    getSongLists,
    getSongList,
    updateSongList,
    deleteSongList,
  } from "../controllers/songlists";
  import express from "express";
  
  const router = express.Router();
  
  // GET /api/songlists
  router.get("/", getSongLists);
  // GET /api/songlists/:id
  router.get("/:id", getSongList);
  // POST /api/songlists
  router.post("/", createSongList);
  // PUT /api/songlists/:id
  router.put("/:id", updateSongList);
  // DELETE /api/songlists/:id
  router.delete("/:id", deleteSongList);
  
  // export the router
  export default router;