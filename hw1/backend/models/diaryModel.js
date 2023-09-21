import mongoose from "mongoose";

// Create a schema
const DiarySchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      required: true,
    },
  },
  // In this case, we want to rename _id to id and remove __v
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    // This option is to make sure that when a new document is created,
    // the timestamps will be added automatically.
    // You can comment this out to see the difference.
    timestamps: true,
  },
);

// Create a model
const DiaryModel = mongoose.model("Diary", DiarySchema);

export default DiaryModel;