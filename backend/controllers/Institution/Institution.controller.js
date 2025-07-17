import bcrypt from "bcrypt";
import { MESSAGES } from "../../utils/index.js";
import {
    authenticateUser,
    ApiResponse,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../../middlewares/index.js";
import Validator from "../../utils/Validators.js";
import { AuthorStatus, Institution, InstitutionAuthor, Student } from "../../models/index.js";
import { BaseController } from "../_BaseController/_BaseController.js";
import Razorpay from "razorpay";
import { env } from "../../env.js";
import crypto from "crypto";
import generateSecurePassword from "../../utils/passwords/generateStrongPassword.js";

export class InstitutionController extends BaseController {
    constructor() {
        super();
        this.createInstitution = this.createInstitution.bind(this);
        this.loginInstitution = this.loginInstitution.bind(this);
        this.institutionRefreshToken = this.institutionRefreshToken.bind(this);
        this.institutionDashboard = this.institutionDashboard.bind(this);
        this.getInstById = this.getInstById.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.razorpay = new Razorpay({
            key_id: env.RAZORPAY_KEY_ID,
            key_secret: env.RAZORPAY_KEY_SECRET,
        });
        this.verifyPayment = this.verifyPayment.bind(this);
        this.transferKCoinsToPublisher =
            this.transferKCoinsToPublisher.bind(this);

        this.changeStudentStatus = this.changeStudentStatus.bind(this);
        this.getInstitutionAuthorRequests = this.getInstitutionAuthorRequests.bind(this);
    }

    async createInstitution(req, res) {
        try {
            const { name, email, phone, password, address } = req.body;

            const validationResponse = await this._validateInstitution(
                req.body,
            );
            if (!validationResponse.success) {
                return this._sendResponse(res, validationResponse.message, 400);
            }

            const existingField = await this._checkExistingFields(email, phone);
            if (existingField) {
                return this._sendResponse(res, existingField, 400);
            }

            const hashedPassword = await this._hashPassword(password);
            const institution = await Institution.create({
                name,
                email,
                phone,
                password: hashedPassword,
                address,
            });

            const newInstitution = this._filterInstitutionData(institution);

            return this._sendResponse(res, MESSAGES.INSTITUTION_CREATED, 201, {
                institution: newInstitution,
            });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async loginInstitution(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
            }

            const institution = await Institution.findOne({ email });
            if (
                !institution ||
                !(await bcrypt.compare(password, institution.password))
            ) {
                return this._sendResponse(
                    res,
                    MESSAGES.INVALID_CREDENTIALS,
                    400,
                );
            }

            const payload = {
                _id: institution._id,
                email: institution.email,
                userType: "institution",
            };

            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            const institutionData = this._filterInstitutionData(institution);

            return this._sendResponse(res, MESSAGES.LOGIN_SUCCESS, 200, {
                institution: institutionData,
                token: accessToken,
                refreshToken,
            });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async institutionRefreshToken(req, res) {
        let refreshToken = req.body.refreshToken;
        if (!refreshToken && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            const tokenParts = authHeader.split(" ");

            if (tokenParts.length === 2 && tokenParts[0] === "Bearer") {
                refreshToken = tokenParts[1];
            }
        }
        try {
            if (!refreshToken) {
                return this._sendResponse(
                    res,
                    "Refresh Token is Required.",
                    400,
                );
            }

            const institution = verifyRefreshToken(refreshToken);
            if (!institution) {
                return this._sendResponse(res, "Invalid Refresh Token", 400);
            }

            const payload = {
                _id: institution._id,
                email: institution.email,
                userType: institution.userType,
            };

            const accessToken = generateAccessToken(payload);

            return this._sendResponse(res, "Refresh Token", 200, {
                token: accessToken,
            });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async institutionDashboard(req, res) {
        const user = req.user;

        if (!this._isAuthorized(user, "institution", res)) return;

        try {
            ///TODO: Need to uncomment the below code later...
            const institution = await Institution.findById(user._id)
                .populate({
                    path: "institutionAuthor",
                    select: "institutionAuthor authorEmail",
                    populate: [
                        {
                            path: "posts",
                            select: "title content files",
                        },
                        {
                            path: "framez",
                            select: "files institution status", // Adjust fields as needed
                        },
                    ],
                })
                .populate("institutionPublisher", "name email")
                // .populate({
                //   path: "institutionPublisher",
                //   select: "name email",
                //   populate: {
                //     path: "institutionAuthors",
                //     select: "institutionAuthor authorEmail",
                //     populate: { path: "posts", select: "title content files" },
                //   },
                // })
                .populate("students", "name email")
                .select("-password -createdAt -updatedAt -isDeleted -__v");

            if (!institution) {
                return this._sendResponse(
                    res,
                    MESSAGES.INSTITUTION_NOT_FOUND,
                    404,
                );
            }

            return this._sendResponse(
                res,
                MESSAGES.INSTITUTIONS_FETCHED_SUCCESSFULLY,
                200,
                { institution },
            );
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async _updateInstitutionData(institutionId, data) {
        const updatedInstitution = await Institution.findByIdAndUpdate(
            institutionId,
            data,
            { new: true },
        );
        return updatedInstitution;
    }

    async getInstById(req, res) {
        try {
            const { institutionId } = req.params;
            const institution = await Institution.findById(institutionId)
                // .select("name avatar address email followers coverImage")
                .select("-password -createdAt -updatedAt -isDeleted -__v")
                .populate({
                    path: "institutionAuthor",
                    select: "institutionAuthor",
                    populate: {
                        path: "posts",
                        select: "title content files likes",
                    },
                });

            if (!institution) {
                return this._sendResponse(
                    res,
                    MESSAGES.INSTITUTION_NOT_FOUND,
                    404,
                );
            }

            const allPosts = institution.institutionAuthor
                .map((author) => author.posts)
                .flat();

            const instutationData = {
                _id: institution._id,
                name: institution.name,
                avatar: institution.avatar,
                coverImage: institution.coverImage,
                address: institution.address,
                email: institution.email,
                followers: institution.followers.length,
                following: institution.followers,
                totalPosts: allPosts.length,
                posts: allPosts,
            };

            return this._sendResponse(
                res,
                MESSAGES.INSTITUTIONS_FETCHED_SUCCESSFULLY,
                200,
                { institution: instutationData },
            );
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    // Add KCoins to Institution
    async _addKCoins(institutionId, amount) {
        const institution = await Institution.findById(institutionId);

        if (!institution) {
            return this._sendResponse(res, MESSAGES.INSTITUTION_NOT_FOUND, 404);
        }

        institution.kcoins += parseFloat(amount);
        await institution.save();

        return this._filterInstitutionData(institution);
    }

    // verify payment
    async verifyPayment(req, res) {
        const instituion = req.user;
        if (!this._isAuthorized(instituion, "institution", res)) return;
        const { orderId, paymentId, signature, amount } = req.body;

        try {
            const shasum = crypto.createHmac("sha256", env.RAZORPAY_KEY_SECRET);
            shasum.update(`${orderId}|${paymentId}`);
            const digest = shasum.digest("hex");

            if (digest !== signature) {
                return this._sendResponse(
                    res,
                    "Payment Verification Failed",
                    400,
                );
            }

            const institution = await this._addKCoins(instituion._id, amount);

            return this._sendResponse(res, "Payment Verified", 200, {
                institution,
            });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    //Create Razorpay Order
    async createOrder(req, res) {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // amount in paise
            currency: "INR",
        };
        console.log(this.razorpay.key_id + " " + this.razorpay.key_secret);
        try {
            const order = await this.razorpay.orders.create(options);
            console.log(order);

            return this._sendResponse(res, "Order Created", 200, order);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    async transferKCoinsToPublisher(req, res) {
        const instituion = req.user;
        if (!this._isAuthorized(instituion, "institution", res)) return;
        const { publisherId, amount } = req.body;

        try {
            const institution = await Institution.findById(instituion._id);

            if (institution.kcoins < amount) {
                return this._sendResponse(res, "Insufficient KCoins", 400);
            }

            const publisher = await this._findPublisherById(publisherId);

            if (!publisher) {
                return this._sendResponse(res, "Publisher Not Found", 404);
            }

            publisher.kcoins += parseFloat(amount);
            await publisher.save();

            institution.kcoins -= parseFloat(amount);
            await institution.save();

            const filteredInstitution =
                this._filterInstitutionData(institution);

            return this._sendResponse(res, "KCoins Transferred", 200, {
                filteredInstitution,
            });
        } catch (error) {
            return this._sendError(res, error);
        }
    }


    async changeStudentStatus(req, res) {
        const institution = req.user;
        if (!this._isAuthorized(institution, "institution", res)) return;

        const { id, status } = req.body;

        const password = generateSecurePassword(7);

        try {
            const statusBody = await AuthorStatus.findById(id);
            if (!statusBody) {
                return this._sendResponse(res, MESSAGES.SOMETHING_WENT_WRONG, 404);
            }

            const student = await Student.findById(statusBody.student);
            if (!student) {
                return this._sendResponse(res, MESSAGES.STUDENT_NOT_FOUND, 404);
            }


            if (!["reject", "approved"].includes(status)) {
                return this._sendResponse(res, MESSAGES.INVALID_STATUS, 400);
            }

            if (status === "reject") {
                statusBody.status = "rejected";
                await statusBody.save();
                return this._sendResponse(res, MESSAGES.OPERATION_SUCCESSFUL, 200);
            }

            else if (status === "approved") {

                const response = await this._findInstitution(institution._id, res);
                if (!response) return;

                const email = student.email;

                const ifAuthorExists = await InstitutionAuthor.findOne({ authorEmail: email, institution: institution._id });

                if (ifAuthorExists) {
                    return this._sendResponse(res, MESSAGES.AUTHOR_EMAIL_ALREADY_EXISTS, 400);
                }

                const hashedPassword = await this._hashPassword(password);

                const author = await InstitutionAuthor.create({
                    institution: institution._id,
                    institutionAuthor: student.name,
                    authorEmail: student.email,
                    institutionPublisher: institution.institutionPublisher[0],
                    password: hashedPassword,
                });

                const filteredAuthor = this._filterAuthorData(author);


                statusBody.status = "approved";
                await statusBody.save();

                const { emailSuccess } = await this._sendAuthorCredentialsEmail({
                    email: student.email,
                    password: password,
                })

                if (!emailSuccess) {
                    return this._sendResponse(res, MESSAGES.SOMETHING_WENT_WRONG, 500);
                }

                return this._sendResponse(res, MESSAGES.AUTHOR_CREATED_SUCCESSFULLY, 200, { ...filteredAuthor });
            }

        } catch (error) {
            return this._sendError(res, error);
        }
    }



    async getInstitutionAuthorRequests(req, res) {
        const institution = req.user;
        if (!this._isAuthorized(institution, "institution", res)) return;

        try {
            const authorRequests = await Institution.findById(institution._id)
                .populate({
                    path: "studentAuthors",
                    select: "-createdAt -updatedAt -isDeleted -__v",
                    populate: {
                        path: "student",
                        select: "name email avatar -_id",
                    }
                })
                .select("_id");

            const { ...authors } = authorRequests._doc;
            return this._sendResponse(res, MESSAGES.SUCCESS, 200, { ...authors });
        } catch (error) {
            return this._sendError(res, error);
        }
    }


    // Protected methods

    async _validateInstitution(data) {
        const validation = await Validator.validateEntity("institution", data);
        return validation;
    }

    async _checkExistingFields(email, phone) {
        const existingField = await Institution.findOne({
            $or: [{ email }, { phone }],
        });
        if (existingField) {
            if (existingField.email === email) {
                return MESSAGES.EMAIL_EXISTS;
            } else if (existingField.phone === phone) {
                return MESSAGES.PHONE_EXISTS;
            }
        }
        return null;
    }

    _filterInstitutionData(institution) {
        const { password, createdAt, updatedAt, isDeleted, ...newInstitution } =
            institution._doc;
        return newInstitution;
    }

    _filterAuthorData(author) {
        const { password, isDeleted, createdAt, updatedAt, __v, ...newAuthor } = author._doc;
        return newAuthor;
    }
}

export const protectedInstitutionRoutes = [authenticateUser];
