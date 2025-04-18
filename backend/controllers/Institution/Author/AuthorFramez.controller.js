import { Framez } from "../../../models/index.js";
import { MESSAGES } from "../../../utils/index.js";
import { BaseController } from "../../_BaseController/_BaseController.js";

export class AuthorFramezController extends BaseController {
    constructor() {
        super();
        this.publishFramez = this.publishFramez.bind(this);
    }

    async publishFramez(req, res) {
        const author = req.user;
        if (!this._isAuthorized(author, "institutionAuthor", res)) return;

        const { files } = req.files;

        // console.log("files", files);

        if (!this._framezHasRequiredFields({ files }, res)) return;

        let fileLocations = [];
        if (files) {
            fileLocations = [...fileLocations, ...files.map((f) => f.location)];
        }

        try {
            const newFrame = await Framez.create({
                files: fileLocations,
                postAuthor: author._id,
                institutionAuthor: author._id, // Assuming this is intentional
            });

            const frame = this._filterKlip(newFrame);
            this._sendResponse(res, MESSAGES.FRAMEZ_CREATED, 201, { frame });
        } catch (error) {
            this._sendError(res, error);
        }
    }

    _filterKlip(frame) {
        const { createdAt, updatedAt, isDeleted, __v, ...filteredFrame } =
            frame._doc;
        return filteredFrame;
    }

    _framezHasRequiredFields(fields, res) {
        const { files } = fields;
        if (!files) {
            this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
            return false;
        }
        return true;
    }
}
