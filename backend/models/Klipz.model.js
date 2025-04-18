import mongoose from "mongoose";
import { InstitutionAuthor } from "./index.js";

const klipzSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    files: {
      type: [String],
      default: [],
    },
    institutionAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstitutionAuthor",
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
    },
    postAuthor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      }
    ],
    status: {
      type: String,
      enum: ["inreview", "published", "rejected"],
      default: "inreview",
    },
  },
  { timestamps: true },
);

klipzSchema.post('save', async function () {
  await InstitutionAuthor.findByIdAndUpdate(
    this.institutionAuthor,
    { $addToSet: { klipz: this._id } },
    { new: true },
  );
});

klipzSchema.post('remove', async function () {
  await InstitutionAuthor.findByIdAndUpdate(
    this.institutionAuthor,
    { $pull: { klipz: this._id } },
    { new: true },
  );
});

export const Klipz = mongoose.model("Klipz", klipzSchema);
