import { InstitutionAuthor } from "../../models/index.js";
import { MESSAGES } from "../../utils/index.js";
import { InstitutionPublisherController } from "./InstitutionPublisher.controller.js";

///TODO: Need to implement the publisherId in the InstitutionAuthorController and InstitutionAuthor Model
export class InstitutionAuthorController extends InstitutionPublisherController {
    constructor() {
        super();
        this.createInstitutionAuthor = this.createInstitutionAuthor.bind(this);
        this.updateInstitutionAuthor = this.updateInstitutionAuthor.bind(this);
        this.deleteInstitutionAuthor = this.deleteInstitutionAuthor.bind(this);
    }

    async createInstitutionAuthor(req, res) {
        const institutionId = req.user._id;

        if (!institutionId) {
            return this._sendResponse(res, MESSAGES.UNAUTHORIZED_ACCESS, 401);
        }

        const { password, institutionAuthor, authorEmail, institutionPublisher } = req.body;

        if (!password || !institutionAuthor || !authorEmail || !institutionPublisher) {
            return this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
        }

        try {
            const institution = await this._findInstitution(institutionId, res);
            if (!institution) return;

            const isAuthorExists = await InstitutionAuthor.findOne({ authorEmail });
            if (isAuthorExists) {
                return this._sendResponse(res, MESSAGES.AUTHOR_EMAIL_ALREADY_EXISTS, 400);
            }

            const hashedPassword = await this._hashPassword(password);

            const author = await InstitutionAuthor.create({
                institution: institutionId,
                institutionAuthor,
                authorEmail,
                institutionPublisher,
                password: hashedPassword,
            });

            const newAuthor = this._filterAuthorData(author);

            return this._sendResponse(res, MESSAGES.AUTHOR_CREATED_SUCCESSFULLY, 201, { author: newAuthor });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async updateInstitutionAuthor(req, res) {
        const institutionId = req.user._id;

        if (!institutionId) {
            return this._sendResponse(res, MESSAGES.UNAUTHORIZED_ACCESS, 401);
        }

        const { authorId, institutionAuthor, authorEmail, institutionPublisher } = req.body;

        if (!authorId) {
            return this._sendResponse(res, 'AuthorID is required', 400);
        }

        try {
            const institution = await this._findInstitution(institutionId, res);
            if (!institution) return;

            const author = await InstitutionAuthor.findById(authorId);
            if (!author) {
                return this._sendResponse(res, MESSAGES.AUTHOR_NOT_FOUND, 404);
            }

            if (institutionAuthor) {
                author.institutionAuthor = institutionAuthor;
            }

            if (institutionPublisher) {
                author.institutionPublisher = institutionPublisher;
            }

            if (authorEmail) {
                const isAuthorExists = await InstitutionAuthor.findOne({ authorEmail });
                if (isAuthorExists) {
                    return this._sendResponse(res, MESSAGES.AUTHOR_EMAIL_ALREADY_EXISTS, 400);
                }
                author.authorEmail = authorEmail;
            }

            await author.save();

            const updatedAuthor = this._filterAuthorData(author);

            return this._sendResponse(res, MESSAGES.AUTHOR_UPDATED_SUCCESSFULLY, 200, { author: updatedAuthor });

        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async deleteInstitutionAuthor(req, res) {
        const institutionId = req.user._id;

        if (!institutionId) {
            return this._sendResponse(res, MESSAGES.UNAUTHORIZED_ACCESS, 401);
        }

        const { authorId } = req.body;

        if (!authorId) {
            return this._sendResponse(res, 'AuthorID is required', 400);
        }

        try {
            const institution = await this._findInstitution(institutionId, res);
            if (!institution) return;

            const author = await InstitutionAuthor.findById(authorId);
            if (!author) {
                return this._sendResponse(res, MESSAGES.AUTHOR_NOT_FOUND, 404);
            }

            await InstitutionAuthor.deleteOne({ _id: authorId });
            author.isDeleted = true;

            await institution.save();

            return this._sendResponse(res, MESSAGES.AUTHOR_DELETED_SUCCESSFULLY, 200);
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    _filterAuthorData(author) {
        const { password, isDeleted, createdAt, updatedAt, ...newAuthor } = author._doc;
        return newAuthor;
    }

}