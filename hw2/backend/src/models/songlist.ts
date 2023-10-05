import type { SongListData } from "@lib/shared_types";
import mongoose from "mongoose";
import type { Types } from "mongoose";

// In `SongListData`, we have `id` as a string and `songs` as an array of `SongData`, but in the database, we want them both to be stored as an ObjectId.
interface SongListDocument
  extends Omit<SongListData, "id" | "songs">,
    mongoose.Document {
  songs: Types.ObjectId[];
}

interface SongListModel extends mongoose.Model<SongListDocument> {}

// We enforce the type by adding `<SongListDocument>` after `mongoose.Schema`.
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

const SongList = mongoose.model<SongListDocument, SongListModel>("List", SongListSchema);
export default SongList; 