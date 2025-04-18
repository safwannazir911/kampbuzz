import mongoose from "mongoose";
import { InstitutionAuthor } from "./index.js";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
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
    // comments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment",
    //   },
    // ],
    status: {
      type: String,
      enum: ["inreview", "published", "rejected"],
      default: "inreview",
    },
  },
  { timestamps: true },
);

postSchema.post('save', async function () {
  await InstitutionAuthor.findByIdAndUpdate(
    this.institutionAuthor,
    { $addToSet: { posts: this._id } },
    { new: true },
  );
});

postSchema.post('remove', async function () {
  await InstitutionAuthor.findByIdAndUpdate(
    this.institutionAuthor,
    { $pull: { posts: this._id } },
    { new: true },
  );
});

export const Post = mongoose.model("Post", postSchema);
