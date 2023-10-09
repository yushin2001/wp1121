import type { SongListData } from "@lib/shared_types";
import mongoose from "mongoose";
import type { Types } from "mongoose";

interface SongListDocument
  extends Omit<SongListData, "id" | "songs">,
    mongoose.Document {
  songs: Types.ObjectId[];
}

interface SongListModel extends mongoose.Model<SongListDocument> {}

const SongListSchema = new mongoose.Schema<SongListDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
        type: String,
        required: true,
      },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const SongList = mongoose.model<SongListDocument, SongListModel>("SongList", SongListSchema);
export default SongList; 