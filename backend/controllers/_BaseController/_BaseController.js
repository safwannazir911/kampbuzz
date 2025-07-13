import { env } from "../../env.js";
import { ApiResponse } from "../../middlewares/index.js";
import {
    Institution,
    InstitutionAuthor,
    InstitutionPublisher,
    Post,
    Student,
    UserOTPVerification,
    Klipz,
    Framez,
} from "../../models/index.js";
import { MESSAGES } from "../../utils/index.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer"; // Import nodemailer
import otpGenerator from "otp-generator";
export class BaseController {
    constructor() {
        this.transporter = this._setupTransporter(); // Initialize transporter in constructor
    }

    async _isStudentExists(email, phone, username) {
        const existingStudent = await Student.findOne({
            $or: [{ email }, { phone }, { username }],
        });

        if (existingStudent) {
            if (existingStudent.username === username) {
                return "username";
            }
            if (existingStudent.email === email) {
                return "email";
            }
            if (existingStudent.phone === phone) {
                return "phone";
            }
        }

        return false;
    }

    async _sendResponse(res, message, statusCode = 200, data = {}) {
        return res
            .status(statusCode)
            .send(new ApiResponse({ message, ...data }, statusCode));
    }

    async _sendError(res, error) {
        console.error(error);
        return res
            .status(500)
            .send(
                new ApiResponse(
                    { message: MESSAGES.SOMETHING_WENT_WRONG },
                    500,
                ),
            );
    }

    async _hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async _comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    async _findInstitution(institutionId) {
        return await Institution.findById(institutionId);
    }

    async _findPost(postId) {
        return await Post.findById(postId);
    }
    async _findKlip(klipId) {
        return await Klipz.findById(klipId);
    }
    async _findFrame(frameId) {
        return await Framez.findById(frameId);
    }

    async _findStudentById(studentId) {
        return await Student.findById(studentId);
    }

    async _findPublisherById(publisherId) {
        return await InstitutionPublisher.findById(publisherId);
    }

    async _findAuthorById(authorId) {
        return await InstitutionAuthor.findById(authorId);
    }

    async _deletePost(postId) {
        return await Post.findByIdAndDelete(postId).select(
            "-createdAt -updatedAt -__v",
        );
    }
    async _deleteKlipz(klipzId) {
        return await Klipz.findByIdAndDelete(klipzId).select(
            "-createdAt -updatedAt -__v",
        );
    }
    async _deleteFramez(frameId) {
        return await Framez.findByIdAndDelete(frameId).select(
            "-createdAt -updatedAt -__v",
        );
    }

    _isAuthorized(user, userType, res) {
        if (!user || user.userType !== userType) {
            this._sendResponse(res, MESSAGES.UNAUTHORIZED_ACCESS, 401);
            return false;
        }
        return true;
    }

    _isValidId(id, res) {
        if (!id) {
            this._sendResponse(res, MESSAGES.INVALID_ID, 400);
            return false;
        }
        return true;
    }

    async _decuctKCoins(postCost, publisherId) {
        const publisher = await this._findPublisherById(publisherId);

        if (!publisher) {
            return this._sendResponse(res, MESSAGES.PUBLISHER_NOT_FOUND, 404);
        }

        if (publisher.kcoins < parseFloat(postCost)) {
            return this._sendResponse(res, MESSAGES.INSUFFICIENT_KCOINS, 400);
        }

        publisher.kcoins -= parseFloat(postCost);
        await publisher.save();

        return publisher;
    }

    _setupTransporter() {
        return nodemailer.createTransport({
            host: env.NODEMAILER_HOST,
            port: env.NODEMAILER_PORT,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: env.NODEMAILER_USER,
                pass: env.NODEMAILER_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
            // Increase the timeout value (in milliseconds)
            connectionTimeout: 50000, // 10 seconds
            greetingTimeout: 10000, // 10 seconds
            socketTimeout: 10000, // 10 seconds
        });
    }

    // Function to send OTP verification email
    async _sendOTPVerificationEmail({ _id, email }) {
        try {
            // Generate the OTP
            const otp = otpGenerator.generate(4, {
                upperCaseAlphabets: false,
                specialChars: false,
                lowerCaseAlphabets: false,
            });

            // Hash the OTP
            const hashedOTP = await this._hashPassword(otp, 10);

            // Create a new OTP verification entry
            const newOTPVerification = new UserOTPVerification({
                userId: _id,
                otp: hashedOTP,
                createdAt: Date.now(),
                expiresAt: Date.now() + 3600000, // Expires in 1 hour
            });

            // Save the OTP verification entry to the database
            await newOTPVerification.save();

            // Set up the email options
            const mailOptions = {
                from: "KampBuzz <noreply@kampbuzz.com>",
                to: email,
                subject: "One-time verification code",
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 100vw; margin: auto; padding: 20px; border: 1px solid #ebefff; background-color: #fbf8ff; border-radius: 5px;">
                  <table align="center" role="presentation" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 1rem; background-color: #f0e9ff; border-radius: 5px; text-align: center;">
                        <img src="https://kb-student.vercel.app/assets/logo-p6Bc42y7.png" alt="KampBuzz Logo" style="max-width: 50px; margin-bottom: 10px;">
                        <h2 style="font-size: 24px; color: #503d58; font-weight: bold; margin-bottom: 10px;">Action Required: One-Time Verification Code</h2>
                        <p style="font-size: 14px; color: #777; margin-bottom: 10px;">You are receiving this email because a request was made for a one-time password that can be used for authentication.</p>
                        <p style="font-size: 14px; color: #777; margin-bottom: 10px;">Please enter the following code for verification:</p>
                        <p style="font-size: 20px; color: #503d58; font-weight: bold; margin-bottom: 10px;">${otp}</p>
                        <p style="font-size: 14px; color: #777; margin-top: 10px;">If you didn't request this code, please ignore this email.</p>
                        <p style="font-size: 14px; color: #777;">Thank you,</p>
                        <p style="font-size: 14px; color: #777;">The KampBuzz Team</p>
                      </td>
                    </tr>
                  </table>
                </div>
                `,
            };

            // Send the email
            const emailSuccess = await new Promise((resolve) => {
                this.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error sending email:", error);
                        resolve(false); // Email sending failed
                    } else {
                        console.log("Email sent:", info.response);
                        resolve(true); // Email sending succeeded
                    }
                });
            });

            // Return the OTP verification entry and email success status
            return {
                otpEntry: newOTPVerification,
                emailSuccess,
            };
        } catch (error) {
            console.error("Error sending OTP email:", error.message);
            return {
                otpEntry: null,
                emailSuccess: false,
            };
        }
    }

    async _sendAuthorCredentialsEmail({ email, password }) {
        try {

            // Set up the email options
            const mailOptions = {
                from: "KampBuzz <noreply@kampbuzz.com>",
                to: email,
                subject: "Welcome to KampBuzz – Your Author Account Is Ready!",
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f9f7ff; border: 1px solid #e0dffc; border-radius: 8px;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://kb-student.vercel.app/assets/logo-p6Bc42y7.png" alt="KampBuzz Logo" style="width: 60px; margin-bottom: 10px;" />
                    <h2 style="color: #4c2b74; font-size: 24px; margin-bottom: 5px;">Welcome to KampBuzz!</h2>
                    <p style="font-size: 14px; color: #777;">Your author account has been successfully created.</p>
                  </div>
            
                  <div style="background-color: #fff; padding: 20px; border-radius: 6px; border: 1px solid #ddd;">
                    <h3 style="color: #503d58; margin-bottom: 10px;">Your Login Credentials</h3>
                    <p style="font-size: 16px; color: #333; margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                    <p style="font-size: 16px; color: #333; margin: 5px 0;"><strong>Password:</strong> ${password}</p>
                    <p style="font-size: 14px; color: #999; margin-top: 10px;">You can change your password after logging in.</p>
                  </div>
            
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="https://kb-author.vercel.app" target="_blank" style="display: inline-block; background-color: #6b44d8; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In to Your Author Account</a>
                  </div>
            
                  <p style="font-size: 13px; color: #888; text-align: center; margin-top: 30px;">If you did not request this account, you can safely ignore this email.</p>
            
                  <p style="font-size: 13px; color: #888; text-align: center;">— The KampBuzz Team</p>
                </div>
              `,
            };


            // Send the email
            const emailSuccess = await new Promise((resolve) => {
                this.transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error sending email:", error);
                        resolve(false); // Email sending failed
                    } else {
                        console.log("Email sent:", info.response);
                        resolve(true); // Email sending succeeded
                    }
                });
            });

            return {
                emailSuccess,
            };
        } catch (error) {
            console.error("Error sending email:", error.message);
            return {
                emailSuccess: false,
            };
        }
    }

}
