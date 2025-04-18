import mongoose from "mongoose";
import { Institution } from ".././index.js";

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            min: 10,
            max: 12,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 20,
        },
        gender: {
            type: String,
            enum: ["male", "female", "others"],
            required: true,
        },
        avatar: {
            type: String,
        },
        images: [
            {
                type: String,
            },
        ],
        videos: [
            {
                type: String,
            },
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        },
        institution: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institution",
            // required: true,
        },

        //Add verified attribute
        verified: {
            type: Boolean,
            default: false,
        },

        bookmarks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Institution",
            },
        ],
        likedPosts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
    },
    { timestamps: true },
);

studentSchema.post("save", async function () {
    await Institution.findByIdAndUpdate(
        this.institution,
        { $addToSet: { students: this._id } },
        { new: true },
    );
});

export const Student = mongoose.model("Student", studentSchema);
