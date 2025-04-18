import mongoose from "mongoose";

//OTP Verification model
const UserOTPVerificationSchema=new mongoose.Schema({
    userId:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date
})

export const UserOTPVerification=mongoose.model("UserOTPVerification",UserOTPVerificationSchema)