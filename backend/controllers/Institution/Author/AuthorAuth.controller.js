import { authenticateUser, generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../../middlewares/index.js";
import { InstitutionAuthor } from "../../../models/index.js";
import { MESSAGES } from "../../../utils/index.js";
import { BaseController } from "../../_BaseController/_BaseController.js";

export class AuthorAuthController extends BaseController {
    constructor() {
        super();
        this.loginAuthor = this.loginAuthor.bind(this);
        this.authorRefreshToken = this.authorRefreshToken.bind(this);
        this.authorDashboard = this.authorDashboard.bind(this);
    }

    async loginAuthor(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
        }

        try {
            const author = await this._findAuthorByEmail(email);

            if (!author) {
                return this._sendResponse(res, MESSAGES.INVALID_CREDENTIALS, 404);
            }

            const isMatch = await this._comparePassword(password, author.password);

            if (!isMatch) {
                return this._sendResponse(res, MESSAGES.INVALID_CREDENTIALS, 400);
            }

            const token = {
                _id: author._id,
                email: author.email,
                userType: "institutionAuthor",
            };

            const accessToken = generateAccessToken(token);
            const refreshToken = generateRefreshToken(token);

            const authorData = this._filterAuthorData(author);

            return this._sendResponse(res, MESSAGES.LOGIN_SUCCESS, 200, {
                user: authorData,
                token: accessToken,
                refreshToken,
            });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async authorRefreshToken(req, res) {
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

            const author = verifyRefreshToken(refreshToken);
            if (!author) {
                return this._sendResponse(res, 'Invalid Refresh token', 401);
            }

            const isAuthorExists = await this._findAuthorById(author._id);
            if (!isAuthorExists) {
                return this._sendResponse(res, 'Author not found', 404);
            }

            const payload = {
                _id: author._id,
                email: author.email,
                userType: "institutionAuthor",
            };

            const accessToken = generateAccessToken(payload);
            return this._sendResponse(res, 'Refresh Token Generated', 200, {
                token: accessToken,
            });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async authorDashboard(req, res) {
        const user = req.user;

        if (!this._isAuthorized(user, "institutionAuthor", res)) return;

        try {
            const author = await InstitutionAuthor.findById(user._id)
                .select("-password -__v -createdAt -updatedAt")
                .populate("institution", "name")
                .populate({
                    path: "posts",
                    match: { postAuthor: user._id },
                    select: 'title content tags likes files status',
                })
                .populate({
                    path: "klipz",
                    select: 'title  tags likes files status',
                })
                .populate({
                    path: "framez",
                    select: 'files status',
                })
                ;

            return this._sendResponse(res, "Author Dashboard", 200, { author });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async _findAuthorByEmail(email) {
        return await InstitutionAuthor.findOne({ authorEmail: email });
    }

    async _updateAuthorData(authorId, data) {
        return await InstitutionAuthor.findByIdAndUpdate(authorId, data, { new: true });
    }

    _filterAuthorData(author) {
        const { password, createdAt, updatedAt, __v, isDeleted, ...authorData } = author._doc;
        return authorData;
    }
}

export const protectedAuthorRoutes = [authenticateUser];
