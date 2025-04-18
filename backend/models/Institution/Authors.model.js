import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 20,
    },
    phone: {
      type: String,
      unique: true,
      min: 10,
      max: 12,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
    department: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Author = mongoose.model("Author", authorSchema);
