import { InstitutionAuthor } from "../../../models/index.js";
import { MESSAGES } from "../../../utils/index.js";
import { BaseController } from "../../_BaseController/_BaseController.js";

export class PublisherCreateAuthorController extends BaseController {
    constructor() {
        super();
        this.createAuthor = this.createAuthor.bind(this);
    }

    async createAuthor(req, res) {
        const publisher = req.user;

        if (!this._isAuthorized(publisher, "institutionPublisher", res)) return;

        const { password, institutionAuthor, authorEmail } = req.body;

        if (!password || !institutionAuthor || !authorEmail) {
            return this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
        }

        try {
            const isAuthorExists = await InstitutionAuthor.findOne({ authorEmail });
            if (isAuthorExists) {
                return this._sendResponse(res, MESSAGES.AUTHOR_EMAIL_ALREADY_EXISTS, 400);
            }

            const hashedPassword = await this._hashPassword(password);

            const author = await InstitutionAuthor.create({
                institutionAuthor,
                authorEmail,
                institutionPublisher: publisher._id,
                institution: publisher.institution,
                password: hashedPassword,
            });

            const newAuthor = this._filterAuthor(author);

            return this._sendResponse(res, MESSAGES.AUTHOR_CREATED_SUCCESSFULLY, 201, { author: newAuthor });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    _filterAuthor(author) {
        const { password, createdAt, updatedAt, __v, isDeleted, ...authorData } = author._doc;
        return authorData;
    }
}