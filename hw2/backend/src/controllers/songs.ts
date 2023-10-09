// Get songs
// Path: backend/src/controllers/songs.ts
import SongModel from "../models/song";
import SongListModel from "../models/songlist";
import { genericErrorHandler } from "../utils/errors";
import type {
  CreateSongPayload,
  CreateSongResponse,
  GetSongResponse,
  GetSongsResponse,
  UpdateSongPayload,
  UpdateSongResponse,
} from "@lib/shared_types";
import type { Request, Response } from "express";


// Get all songs
export const getSongs = async (_: Request, res: Response<GetSongsResponse>) => {
  try {
    const dbSongs = await SongModel.find({});
    const songs = dbSongs.map((song) => ({
      id: song.id as string,
      song: song.song,
      singer: song.singer,
      link: song.link,
      song_list_id: song.song_list_id.toString(),
    }));
    return res.status(200).json(songs);
  } catch (error) {
    genericErrorHandler(error, res);
  }
};


// Get a song
export const getSong = async (
  req: Request<{ id: string }>,
  res: Response<GetSongResponse | { error: string }>,
) => {
  try {
    const { id } = req.params;

    const song = await SongModel.findById(id);
    if (!song) {
      return res.status(404).json({ error: "id is not valid" });
    }

    return res.status(200).json({
      id: song.id as string,
      song: song.song,
      singer: song.singer,
      link: song.link,
      song_list_id: song.song_list_id.toString(),
    });
  } catch (error) {
    genericErrorHandler(error, res);
  }
};


// Create a song
export const createSong = async (
  req: Request<never, never, CreateSongPayload>,
  res: Response<CreateSongResponse | { error: string }>,
) => {
  try {
    const { song, singer, link, song_list_id } = req.body;

    // Check if the songlist exists
    const songlist = await SongListModel.findById(song_list_id);
    if (!songlist) {
      return res.status(404).json({ error: "song_list_id is not valid" });
    }

    const new_song = await SongModel.create({
      song,
      singer,
      link,
      song_list_id,
    });

    // Add the song to the list
    songlist.songs.push(new_song._id);
    await songlist.save();

    return res.status(201).json({
      id: new_song.id as string,
    });
  } catch (error) {
    genericErrorHandler(error, res);
  }
};


// Update a song
// In `updateSong` function, 2 database operations are performed:
// 1. Update the song
// 2. Update the songlist
// If one of them fails, we need to rollback the other one.
// To do that, we need to use mongoose transaction.
export const updateSong = async (
  req: Request<{ id: string }, never, UpdateSongPayload>,
  res: Response<UpdateSongResponse | { error: string }>,
) => {
  const session = await SongModel.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { song, singer, link, song_list_id } = req.body;

    const oldSong = await SongModel.findById(id);
    if (!oldSong) {
      return res.status(404).json({ error: "id is not valid" });
    }
    // If the user wants to update the song_list_id, we need to check if the songlist exists
    if (song_list_id) {
      // Check if the list exists
      const songlistExists = await SongModel.findById(song_list_id);
      if (!songlistExists) {
        return res.status(404).json({ error: "song_list_id is not valid" });
      }
    }

    const newSong = await SongModel.findByIdAndUpdate(
      id,
      {
        song: song,
        singer: singer,
        link: link,
        song_list_id: song_list_id,
      },
      { new: true },
    );

    if (!newSong) {return res.status(404).json({ error: "id is not valid" });}

    // If the user wants to update the song_list_id, we need to update the songlist as well
    if (song_list_id) {
      // Remove the song from the old songlist
      const oldSongList = await SongListModel.findById(oldSong.song_list_id);
      if (!oldSongList) {return res.status(404).json({ error: "song_list_id is not valid" });}
      oldSongList.songs = oldSongList.songs.filter((songId) => songId.toString() !== id);
      await oldSongList.save();

      // Add the song to the new list
      const newSongList = await SongListModel.findById(song_list_id);
      if (!newSongList) {return res.status(404).json({ error: "song_list_id is not valid" });}
      newSongList.songs.push(newSong.id);
      await newSongList.save();
    }
    await session.commitTransaction();
    return res.status(200).send("OK");
  } catch (error) {
    await session.abortTransaction();
    genericErrorHandler(error, res);
  }
};


// Delete a song
export const deleteSong = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  // Create mongoose transaction
  const session = await SongModel.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Delete the song from the database
    const deletedSong = await SongModel.findByIdAndDelete(id);
    if (!deletedSong) {
      return res.status(404).json({ error: "id is not valid" });
    }

    // Delete the song from the songlist
    const songlist = await SongListModel.findById(deletedSong.song_list_id);
    if (!songlist) {
      return res.status(404).json({ error: "song_list_id is not valid" });
    }
    songlist.songs = songlist.songs.filter((songId) => songId.toString() !== id);
    await songlist.save();

    // Commit the transaction
    session.commitTransaction();

    return res.status(200).send("OK");
  } catch (error) {
    session.abortTransaction();
    genericErrorHandler(error, res);
  }
};