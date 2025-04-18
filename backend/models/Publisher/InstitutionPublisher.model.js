import mongoose from "mongoose";
import { Institution } from "../index.js";

const institutionPublisherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    },
    address: {
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
    institutionAuthors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "InstitutionAuthor",
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    kcoins: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

institutionPublisherSchema.post('save', async function () {
    await Institution.findByIdAndUpdate(
        this.institution,
        { $addToSet: { institutionPublisher: this._id } },
        { new: true },
    );
});

institutionPublisherSchema.post('remove', async function () {
    await Institution.findOne(
        this.institution,
        { $pull: { institutionPublisher: this._id } },
        { new: true },
    );
});

export const InstitutionPublisher = mongoose.model("InstitutionPublisher", institutionPublisherSchema);