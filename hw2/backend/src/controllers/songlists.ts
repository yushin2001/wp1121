import SongModel from "../models/song";
import SongListModel from "../models/songlist";
import { genericErrorHandler } from "../utils/errors";
import type {
  SongData,
  CreateSongListPayload,
  CreateSongListResponse,
  GetSongListsResponse,
  SongListData,
  UpdateSongListPayload,
} from "@lib/shared_types";
import type { Request, Response } from "express";

// Get all songlists
export const getSongLists = async (_: Request, res: Response<GetSongListsResponse>) => {
  try {
    const songlists = await SongListModel.find({});

    // Return only the id and name of the list
    const songlistsToReturn = songlists.map((songlist) => {
      return {
        id: songlist.id,
        name: songlist.name,
        description: songlist.description
      };
    });

    return res.status(200).json(songlistsToReturn);
  } catch (error) {
    genericErrorHandler(error, res);
  }
};


// Get a songlist
export const getSongList = async (
  req: Request<{ id: string }>,
  res: Response<SongListData | { error: string }>,
) => {
  try {
    const { id } = req.params;
    const songlists = await SongListModel.findById(id).populate("songs");
    if (!songlists) {
      return res.status(404).json({ error: "id is not valid" });
    }

    return res.status(200).json({
      id: songlists.id,
      name: songlists.name,
      description: songlists.description,
      songs: songlists.songs as unknown as SongData[],
    });
  } catch (error) {
    genericErrorHandler(error, res);
  }
};


// Create a songlist
export const createSongList = async (
  req: Request<never, never, CreateSongListPayload>,
  res: Response<CreateSongListResponse>,
) => {
  try {
    const { id } = await SongListModel.create(req.body);
    return res.status(201).json({ id });
  } catch (error) {
    genericErrorHandler(error, res);
  }
};


// Update a songlist
export const updateSongList = async (
  req: Request<{ id: string }, never, UpdateSongListPayload>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Update the songlist
    const newSongList = await SongListModel.findByIdAndUpdate(
      id,
      {
        name: name,
        description: description,
      },
      { new: true },
    );

    // If the songlist is not found, return 404
    if (!newSongList) {
      return res.status(404).json({ error: "id is not valid" });
    }

    return res.status(200).send("OK");
  } catch (error) {
    genericErrorHandler(error, res);
  }
};


// Delete a songlist
export const deleteSongList = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  // Create a transaction
  const session = await SongListModel.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const deletedSongList = await SongListModel.findByIdAndDelete(id).session(session);
    if (!deletedSongList) {
      throw new Error("id is not valid");
    }
    await SongModel.deleteMany({ song_list_id: id }).session(session);
    await session.commitTransaction();
    res.status(200).send("OK");
  } catch (error) {
    await session.abortTransaction();
    genericErrorHandler(error, res);
  } finally {
    session.endSession();
  }
};