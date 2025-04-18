import { generateAccessToken, authenticateUser, generateRefreshToken, verifyRefreshToken } from "../../../middlewares/index.js";
import { InstitutionPublisher } from "../../../models/index.js";
import { MESSAGES } from "../../../utils/index.js";
import { BaseController } from "../../_BaseController/_BaseController.js";


export class PublisherAuthController extends BaseController {
    constructor() {
        super();
        this.loginPublisher = this.loginPublisher.bind(this);
        this.publisherRefreshToken = this.publisherRefreshToken.bind(this);
        this.publisherDashboard = this.publisherDashboard.bind(this);
        this.updatePublisher = this.updatePublisher.bind(this);
    }

    async loginPublisher(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
        }

        try {
            const publisher = await this._findPublisherByEmail(email);

            if (!publisher) {
                return this._sendResponse(res, MESSAGES.INVALID_CREDENTIALS, 404);
            }

            const isMatch = await this._comparePassword(password, publisher.password);

            if (!isMatch) {
                return this._sendResponse(res, MESSAGES.INVALID_CREDENTIALS, 400);
            }

            const token = {
                _id: publisher._id,
                email: publisher.email,
                institution: publisher.institution,
                userType: "institutionPublisher",
            };

            const accessToken = generateAccessToken(token);
            const refreshToken = generateRefreshToken(token);

            const publisherData = this._filterPublisherData(publisher);

            return this._sendResponse(res, MESSAGES.LOGIN_SUCCESS, 200, {
                user: publisherData,
                token: accessToken,
                refreshToken,
            });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async publisherRefreshToken(req, res) {
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

            const publisher = verifyRefreshToken(refreshToken);
            if (!publisher) {
                return this._sendResponse(res, 'Invalid Refresh Token', 400);
            }

            const isPublisherExists = await this._findPublisherById(publisher._id);
            if (!isPublisherExists) {
                return this._sendResponse(res, 'Publisher Not Found', 404);
            }

            const payload = {
                _id: publisher._id,
                email: publisher.email,
                institution: publisher.institution,
                userType: "institutionPublisher",
            };

            const accessToken = generateAccessToken(payload);

            return this._sendResponse(res, 'Refresh Token', 200, { token: accessToken });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async publisherDashboard(req, res) {
        const user = req.user;

        if (!this._isAuthorized(user, "institutionPublisher", res)) return;

        try {
            const publisher = await this._findPublisherById(user._id);

            return this._sendResponse(res, 'Publisher Dashboard', 200, { publisher });
        } catch (error) {
            return this._sendError(res, error);
        }
    }


    async updatePublisher(req, res) {
        const user = req.user;
        if (!this._isAuthorized(user, "institutionPublisher", res)) return;

        const { name } = req.body;
        const { files } = req?.files;
        if (!files) {
            return this._sendResponse(res, 'Please upload an image', 400);
        }
        // console.log(files);
        const avatar = files[0].location;
        console.log(avatar);

        try {
            const publisher = await this._updatePublisherData(user._id, { avatar, name });

            const newPublisher = await this._filterPublisherData(publisher);

            return this._sendResponse(res, 'Publisher Updated', 200, { publisher: newPublisher });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async _updatePublisherData(publisherId, data) {
        return await InstitutionPublisher.findByIdAndUpdate(publisherId, data, { new: true });
    }

    async _findPublisherByEmail(email) {
        return await InstitutionPublisher.findOne({ email });
    }

    async _findPublisherById(publisherId) {
        return await InstitutionPublisher.findById(publisherId)
            .select("-password -__v -createdAt -updatedAt")
            .populate("institution", "name")
            .populate({
                path: "institutionAuthors",
                select: "authorEmail institutionAuthor",
                populate: [{
                    path: "posts",
                    select: "title content tags files status",
                }
                    , {
                    path: "klipz",
                    select: "content tags files status",
                }
                    , {
                    path: "framez",
                    select: "files status",
                }
                ]

            });
    }

    _filterPublisherData(publisher) {
        const { password, createdAt, updatedAt, __v, isDeleted, ...publisherData } = publisher._doc;
        return publisherData;
    }
}

export const protectedPublisherRoutes = [authenticateUser];