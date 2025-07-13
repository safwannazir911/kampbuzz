import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema(
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
        address: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        coverImage: {
            type: String,
        },
        institutionAuthor: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "InstitutionAuthor",
            },
        ],
        institutionPublisher: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "InstitutionPublisher",
            },
        ],
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        framez: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Framez",
            },
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
            },
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        },
        kcoins: {
            type: Number,
            default: 0,
        },

        studentAuthors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "AuthorStatus",
            }
        ]
    },
    { timestamps: true },
);

export const Institution = mongoose.model("Institution", institutionSchema);
