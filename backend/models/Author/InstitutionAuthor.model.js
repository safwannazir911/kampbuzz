import mongoose from "mongoose";
import { Institution, InstitutionPublisher } from "../index.js";

const authorSchema = new mongoose.Schema(
  {
    institutionAuthor: {
      type: String,
      required: true,
    },
    authorEmail: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
    },
    institutionPublisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstitutionPublisher",
      // required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    klipz: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Klipz",
      },
    ],
    framez: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Framez",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

authorSchema.post('save', async function () {
  await Institution.findByIdAndUpdate(
    this.institution,
    { $addToSet: { institutionAuthor: this._id } },
    { new: true },
  );
  await InstitutionPublisher.findByIdAndUpdate(
    this.institutionPublisher,
    { $addToSet: { institutionAuthors: this._id } },
    { new: true },
  );
});

authorSchema.post('remove', async function () {
  await Institution.findOne(
    this.institution,
    { $pull: { institutionAuthor: this._id } },
    { new: true },
  );
  await InstitutionPublisher.findByIdAndUpdate(
    this.institutionPublisher,
    { $pull: { institutionAuthors: this._id } },
    { new: true },
  );
});


export const InstitutionAuthor = mongoose.model("InstitutionAuthor", authorSchema);
