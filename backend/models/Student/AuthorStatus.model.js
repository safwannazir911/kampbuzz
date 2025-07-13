import mongoose from "mongoose";




const authorStatusSchema = new mongoose.Schema(

    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        verificationDocument: {
            type: String,
        }
    },

    {
        timestamps: true,
    }


);


export const AuthorStatus = mongoose.model("AuthorStatus", authorStatusSchema);





