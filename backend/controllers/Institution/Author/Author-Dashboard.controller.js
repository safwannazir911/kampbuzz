import { MESSAGES } from "../../../utils/index.js";
import { AuthorAuthController } from "./AuthorAuth.controller.js";



export class AuthorDashboardController extends AuthorAuthController {
    constructor() {
        super();
        this.updateAuthor = this.updateAuthor.bind(this);
        this.updateAuthorAvatar = this.updateAuthorAvatar.bind(this);
    }

    async updateAuthor(req, res) {
        const user = req.user;
        if (!this._isAuthorized(user, "institutionAuthor", res)) return;

        const { institutionAuthor } = req.body;
        if (!institutionAuthor) {
            return this._sendResponse(res, 'Please provide institution author name', 400);
        }

        try {
            const existingAuthor = await this._findAuthorById(user._id);
            if (!existingAuthor) {
                return this._sendResponse(res, MESSAGES.AUTHOR_NOT_FOUND, 404);
            }

            const updatedAuthor = await this._updateAuthorData(user._id, { institutionAuthor });
            const authorData = this._filterAuthorData(updatedAuthor);

            return this._sendResponse(res, MESSAGES.AUTHOR_UPDATED, 200, { author: authorData });
        }
        catch (error) {
            return this._sendError(res, error);
        }
    }

    async updateAuthorAvatar(req, res) {
        const user = req.user;
        if (!this._isAuthorized(user, "institutionAuthor", res)) return;

        const { files } = req?.files;
        if (!files) {
            return this._sendResponse(res, 'Please upload an image', 400);
        }
        const avatar = files[0]?.location;
        console.log("Avatar", avatar);

        try {
            const existingAuthor = await this._findAuthorById(user._id);
            if (!existingAuthor) {
                return this._sendResponse(res, MESSAGES.AUTHOR_NOT_FOUND, 404);
            }

            const updatedAuthor = await this._updateAuthorData(user._id, { avatar });
            const authorData = this._filterAuthorData(updatedAuthor);

            return this._sendResponse(res, MESSAGES.AUTHOR_UPDATED, 200, { author: authorData });
        } catch (error) {
            return this._sendError(res, error);
        }
    }
}