import mongoose from "mongoose";
import { InstitutionAuthor } from "./index.js";

const framezSchema = new mongoose.Schema(
    {
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
        status: {
            type: String,
            enum: ["inreview", "published", "rejected"],
            default: "inreview",
        },
    },
    { timestamps: true },
);

framezSchema.post("save", async function () {
    await InstitutionAuthor.findByIdAndUpdate(
        this.institutionAuthor,
        { $addToSet: { framez: this._id } },
        { new: true },
    );
});

framezSchema.post("remove", async function () {
    await InstitutionAuthor.findByIdAndUpdate(
        this.institutionAuthor,
        { $pull: { framez: this._id } },
        { new: true },
    );
});

export const Framez = mongoose.model("Framez", framezSchema);
