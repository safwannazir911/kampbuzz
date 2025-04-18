import mongoose from "mongoose";
import { env } from "../env.js";

export const connectDB = async () => {
    try {
        if (!env.MONOGDB_URI) {
            throw new Error("MongoDB connection URL is not defined.");
        }

        await mongoose.connect(env.MONOGDB_URI);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};
