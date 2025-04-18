import { Student, UserOTPVerification } from "../../models/index.js";
import { MESSAGES } from "../../utils/index.js";
import {
  authenticateUser,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../middlewares/index.js";
import Validator from "../../utils/Validators.js";
import { BaseController } from "../_BaseController/_BaseController.js";

export class StudentController extends BaseController {
  constructor() {
    super();
    this.createStudent = this.createStudent.bind(this);
    this.updateStudent = this.updateStudent.bind(this);
    this.loginStudent = this.loginStudent.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.studentDashboard = this.studentDashboard.bind(this);
    this.verifyOTP = this.verifyOTP.bind(this);
    this.resendOTP = this.resendOTP.bind(this);
    this.requestPasswordReset = this.requestPasswordReset.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.verifyOTPForForgotPassword = this.verifyOTPForForgotPassword.bind(this);
    this.sendOTP = this.sendOTP.bind(this);
  }

  async createStudent(req, res) {
    try {
      const studentValidation = await Validator.validateEntity(
        "student",
        req.body,
      );
      if (!studentValidation.success) {
        return this._sendResponse(res, studentValidation.message, 400);
      }

      const {
        name,
        username,
        email,
        phone,
        password,
        gender,
        institution,
      } = req.body;
      const existingField = await this._isStudentExists(
        email,
        phone,
        username,
      );

      if (existingField) {
        let errorMessage;
        switch (existingField) {
          case "email":
            errorMessage = MESSAGES.EMAIL_EXISTS;
            break;
          case "phone":
            errorMessage = MESSAGES.PHONE_EXISTS;
            break;
          case "username":
            errorMessage = MESSAGES.USERNAME_EXISTS;
            break;
          default:
            errorMessage = MESSAGES.STUDENT_EXISTS;
            break;
        }
        return this._sendResponse(res, errorMessage, 400);
      }

      const hashedPassword = await this._hashPassword(password);
      const newStudent = await Student.create({
        name,
        username,
        email,
        phone,
        password: hashedPassword,
        gender,
        institution,
      });

      // Trigger sending OTP verification email
      const { otpEntry, emailSuccess } =
        await this._sendOTPVerificationEmail({
          _id: newStudent._id,
          email,
        });

      if (emailSuccess) {
        const student = this._filterStudentData(newStudent);
        return this._sendResponse(res, MESSAGES.STUDENT_CREATED, 201, {
          otpEntry,
          student,
        });
      } else {
        await Student.findByIdAndDelete(newStudent._id);
        return this._sendResponse(res, MESSAGES.EMAIL_FAILED, 500);
      }
    } catch (error) {
      return this._sendError(res, error);
    }
  }

  async updateStudent(req, res) {
    const user = req.user;

    if (!this._isAuthorized(user, "student", res)) return;

    const { name, email, phone, username, gender, password } = req.body;

    try {
      const student = await Student.findById(user._id);
      if (!student) {
        return this._sendResponse(res, MESSAGES.STUDENT_NOT_FOUND, 404);
      }

      if (email) {
        const existingStudent = await Student.findOne({ email });
        if (
          existingStudent &&
          existingStudent._id.toString() !== user._id
        ) {
          return this._sendResponse(res, MESSAGES.EMAIL_EXISTS, 400);
        }
        student.email = email;
      }

      if (username) {
        const existingStudent = await Student.findOne({ username });
        if (
          existingStudent &&
          existingStudent._id.toString() !== user._id
        ) {
          return this._sendResponse(
            res,
            MESSAGES.USERNAME_EXISTS,
            400,
          );
        }
        student.username = username;
      }

      if (password) {
        student.password = await this._hashPassword(password);
      }

      if (phone) {
        const existingStudent = await Student.findOne({ phone });
        if (
          existingStudent &&
          existingStudent._id.toString() !== user._id
        ) {
          return this._sendResponse(res, MESSAGES.PHONE_EXISTS, 400);
        }
        student.phone = phone;
      }

      if (name) {
        student.name = name;
      }

      if (gender) {
        student.gender = gender;
      }

      await student.save();
      const studentData = this._filterStudentData(student);

      return this._sendResponse(res, MESSAGES.STUDENT_UPDATED, 200, {
        studentData,
      });
    } catch (error) {
      return this._sendError(res, error);
    }
  }

  async loginStudent(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
      }

      const student = await Student.findOne({ email });
      if (!student) {
        return this._sendResponse(
          res,
          MESSAGES.INVALID_CREDENTIALS,
          404,
        );
      }

      const passwordMatch = await this._comparePassword(
        password,
        student.password,
      );
      if (!passwordMatch) {
        return this._sendResponse(
          res,
          MESSAGES.INVALID_CREDENTIALS,
          401,
        );
      }

      // Check if the student is verified
      if (!student.verified) {
        const { otpEntry, emailSuccess } =
          await this._sendOTPVerificationEmail({
            _id: student._id,
            email,
          });
        if (emailSuccess) {
          return res.status(200).send({
            message: MESSAGES.NOT_VERIFIED,
            otpEntry,
            userId: student._id,
          });
        } else {
          return this._sendResponse(res, MESSAGES.EMAIL_FAILED, 500);
        }
      }

      const payload = {
        _id: student._id,
        email: student.email,
        userType: "student",
      };

      const token = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      const {
        password: pass,
        images,
        videos,
        isDeleted,
        createdAt,
        updatedAt,
        __v,
        ...studentData
      } = student._doc;

      return this._sendResponse(res, MESSAGES.LOGIN_SUCCESS, 200, {
        user: studentData,
        token: token,
        refreshToken
      });
    } catch (error) {
      return this._sendError(res, error);
    }
  }

  async refreshToken(req, res) {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      const tokenParts = authHeader.split(' ');

      if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
        refreshToken = tokenParts[1];
      }
    }
    try {
      if (!refreshToken) {
        return this._sendResponse(res, 'Refresh Token is Required.', 400);
      }

      const user = verifyRefreshToken(refreshToken);
      if (!user) {
        return this._sendResponse(res, 'Invalid Refresh token', 401);
      }

      const student = await Student.findById(user._id);
      if (!student) {
        return this._sendResponse(res, MESSAGES.STUDENT_NOT_FOUND, 404);
      }

      const payload = {
        _id: student._id,
        email: student.email,
        userType: "student",
      };

      const accessToken = generateAccessToken(payload);
      return this._sendResponse(res, 'Refresh Token Generated', 200, {
        token: accessToken,
      });
    } catch (error) {
      return this._sendError(res, error);
    }
  }

  async studentDashboard(req, res) {
    const user = req.user;

    if (!this._isAuthorized(user, "student", res)) return;

    try {
      const student = await Student.findById(user._id);
      if (!student) {
        return this._sendResponse(res, MESSAGES.STUDENT_NOT_FOUND, 404);
      }

      const studentData = this._filterStudentData(student);
      return this._sendResponse(res, "Student Dashboard", 200, {
        studentData,
      });
    } catch (error) {
      return this._sendError(res, error);
    }
  }

  _filterStudentData(student) {
    const { password, createdAt, updatedAt, isDeleted, ...newStudent } =
      student._doc;
    return newStudent;
  }

  async _updateStudentData(studentId, data) {
    return await Student.findByIdAndUpdate(studentId, data, { new: true });
  }

  //Function to verify OTP
  async verifyOTP(req, res) {
    try {
      let { userId, otp } = req.body;
      console.log(req.body);
      const student = await Student.findById(userId);

      if (!userId || !otp) {
        return this._sendResponse(res, MESSAGES.EMPTY_OTP, 400);
      } else {
        const UserOTPVerificationRecords =
          await UserOTPVerification.find({
            userId,
          })
            .sort({ createdAt: -1 })
            .limit(1); // Sort by createdAt in descending order and limit to 1 record
        console.log(UserOTPVerificationRecords);
        if (UserOTPVerificationRecords.length <= 0) {
          return this._sendResponse(res, MESSAGES.NOT_RECORD, 400);
        } else {
          const latestRecord = UserOTPVerificationRecords[0]; // Access the latest record
          const expiresAt = latestRecord.expiresAt;
          const hashedOTP = latestRecord.otp;
          if (expiresAt < Date.now()) {
            await UserOTPVerification.deleteMany({ userId });
            return this._sendResponse(
              res,
              MESSAGES.EXPIRED_OTP,
              400,
            );
          } else {
            const validOTP = await this._comparePassword(
              otp,
              hashedOTP,
            );
            if (!validOTP) {
              return this._sendResponse(
                res,
                MESSAGES.INVALID_OTP,
                400,
              );
            } else {
              await Student.updateOne(
                { _id: userId },
                { verified: true },
              );
              await UserOTPVerification.deleteMany({ userId });

              const token = {
                _id: student._id,
                email: student.email,
                userType: "student",
              };

              const accessToken = generateAccessToken(token);
              return this._sendResponse(
                res,
                MESSAGES.VERIFIED,
                200,
                { token: accessToken },
              );
            }
          }
        }
      }
    } catch (error) {
      return this._sendError(res, error);
    }
  }

  //Function to resend OTP
  async resendOTP(req, res) {
    try {
      let { userId } = req.body;
      const student = await Student.findById(userId);
      console.log(student);
      const email = student.email;
      if (!userId || !email) {
        return this._sendResponse(res, MESSAGES.USER_INVALID, 400);
      } else {
        const { otpEntry, emailSuccess } =
          await this._sendOTPVerificationEmail({
            _id: userId,
            email,
          });

        if (emailSuccess) {
          return this._sendResponse(res, MESSAGES.RESEND_OTP, 200, {
            otpEntry,
          });
        } else {
          return this._sendResponse(res, MESSAGES.EMAIL_FAILED, 500);
        }
      }
    } catch (error) {
      return this._sendError(res, error);
    }
  }


  async sendOTP(req, res) {
    try {
      let { email } = req.body;
      if (!email) {
        return this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
      }

      const student = await Student.findOne({ email });

      if (!student) {
        return this._sendResponse(res, MESSAGES.STUDENT_NOT_FOUND, 400);
      } else {
        const { otpEntry, emailSuccess } =
          await this._sendOTPVerificationEmail({
            _id: student._id,
            email,
          });

        if (emailSuccess) {
          return this._sendResponse(res, MESSAGES.RESEND_OTP, 200, {
            otpEntry,
          });
        } else {
          return this._sendResponse(res, MESSAGES.EMAIL_FAILED, 500);
        }
      }
    } catch (error) {
      return this._sendError(res, error);
    }
  }



  async requestPasswordReset(req, res) {
    try {
      const { email, currentPassword, newPassword } = req.body;
      console.log(req.body);

      if (!email || !currentPassword || !newPassword) {
        return this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
      }

      const student = await Student.findOne({ email });

      if (!student) {
        return this._sendResponse(res, MESSAGES.STUDENT_NOT_FOUND, 404);
      }

      const validateOldPassword = await this._comparePassword(
        currentPassword,
        student.password,
      );
      if (!validateOldPassword) {
        return this._sendResponse(
          res,
          MESSAGES.INVALID_CURRENT_PASSWORD,
          400,
        );
      }


      const passwordSameAsCurrent = await this._comparePassword(
        newPassword,
        student.password,
      );
      if (passwordSameAsCurrent) {
        return this._sendResponse(
          res,
          MESSAGES.PASS_SAME_AS_CURRENT,
          400,
        );
      }

      const hashedPassword = await this._hashPassword(newPassword);

      await Student.updateOne(
        { email },
        {
          $set: {
            password: hashedPassword,
            verified: false,
          },
        },
      );

      const { otpEntry, emailSuccess } =
        await this._sendOTPVerificationEmail({
          _id: student._id,
          email,
        });

      if (emailSuccess) {
        return res.status(200).send({
          message: MESSAGES.PASS_RESET_SUCCESS,
          otpEntry,
          userId: student._id,
        });
      } else {
        return this._sendResponse(res, MESSAGES.EMAIL_FAILED, 500);
      }
    } catch (error) {
      return this._sendError(res, error);
    }
  }

  async verifyOTPForForgotPassword({ userId, otp }, req, res) {
    try {
      const student = await Student.findById(userId);
      if (!userId || !otp) {
        return this._sendResponse(res, MESSAGES.EMPTY_OTP, 400);
      } else {
        const UserOTPVerificationRecords =
          await UserOTPVerification.find({
            userId,
          })
            .sort({ createdAt: -1 })
            .limit(1); // Sort by createdAt in descending order and limit to 1 record
        console.log(UserOTPVerificationRecords);
        if (UserOTPVerificationRecords.length <= 0) {
          return this._sendResponse(res, MESSAGES.NOT_RECORD, 400);
        } else {
          const latestRecord = UserOTPVerificationRecords[0]; // Access the latest record
          const expiresAt = latestRecord.expiresAt;
          const hashedOTP = latestRecord.otp;
          if (expiresAt < Date.now()) {
            await UserOTPVerification.deleteMany({ userId });
            return this._sendResponse(
              res,
              MESSAGES.EXPIRED_OTP,
              400,
            );
          } else {
            const validOTP = await this._comparePassword(
              otp,
              hashedOTP,
            );
            if (!validOTP) {
              return this._sendResponse(
                res,
                MESSAGES.INVALID_OTP,
                400,
              );
            } else {
              await UserOTPVerification.deleteMany({ userId });

              const token = {
                _id: student._id,
                email: student.email,
                userType: "student",
              };

              const accessToken = generateAccessToken(token);
              return { token: accessToken };
            }
          }
        }
      }
    } catch (error) {
      return this._sendError(res, error);
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email, otp, password } = req.body;
      console.log(req.body);

      if (!email || !otp || !password) {
        return this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
      }

      const student = await Student.findOne({ email });

      if (!student) {
        return this._sendResponse(res, MESSAGES.STUDENT_NOT_FOUND, 404);
      }

      const userId = student._id;

      const passwordSameAsCurrent = await this._comparePassword(
        password,
        student.password,
      );
      if (passwordSameAsCurrent) {
        return this._sendResponse(
          res,
          MESSAGES.PASS_SAME_AS_CURRENT,
          400,
        );
      } else {
        // Verify OTP for password reset
        const result = await this.verifyOTPForForgotPassword(
          {
            userId,
            otp,
          },
          req,
          res,
        );
        if (result && result.token) {
          // Check if OTP verification was successful and received a token
          const hashedPassword = await this._hashPassword(password);

          // Update student's password
          await Student.updateOne(
            { _id: student._id },
            {
              $set: {
                password: hashedPassword,
              },
            },
          );
          return this._sendResponse(
            res,
            MESSAGES.PASSWORD_RESET_SUCCESSFUL,
            200, {
            token: result.token,
          }
          );
        }
      }
    } catch (error) {
      return this._sendError(res, error);
    }
  }
}

export const protectedStudentRoutes = [authenticateUser];
