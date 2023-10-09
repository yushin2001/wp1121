import type { SongData } from "@lib/shared_types";
import mongoose from "mongoose";
import type { Types } from "mongoose";

// In `SongData`, we have `list_id` and `id` as a string, but in the database, we want to store them as an ObjectId.
interface SongDocument
  extends Omit<SongData, "id" | "song_list_id">,
    mongoose.Document {
  song_list_id: Types.ObjectId;
}

interface SongModel extends mongoose.Model<SongDocument> {}

// We enforce the type by adding `<SongDocument>` after `mongoose.Schema`.
const SongSchema = new mongoose.Schema<SongDocument>(
  {
    song: {
      type: String,
      required: true,
    },
    singer: {
      type: String,
      required: true,
    },
    link: {
        type: String,
        required: true,
    },
    song_list_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SongList",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id.toString();
        ret.song_list_id = ret.song_list_id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

const Song = mongoose.model<SongDocument, SongModel>("Song", SongSchema);
export default Song; 