import { Klipz} from "../../../models/index.js";
import { MESSAGES } from "../../../utils/index.js";
import { BaseController } from "../../_BaseController/_BaseController.js";

export class AuthorKlipzController extends BaseController {
    constructor() {
        super();
        this.publishKlipz = this.publishKlipz.bind(this);

    }

    async publishKlipz(req, res) {
        const author = req.user;
        if (!this._isAuthorized(author, "institutionAuthor", res)) return;

        const { content, tags } = req.body;
        const { files } = req.files;

        // console.log("files", files);

        if (!this._klipzHasRequiredFields({ content,tags,files }, res)) return;

        let fileLocations = [];
        if (files) {
            fileLocations = [...fileLocations, ...files.map(f => f.location)];
        }

        try {
            const newKlip = await Klipz.create({
                content,
                tags,
                files: fileLocations,
                postAuthor: author._id,
                institutionAuthor: author._id, // Assuming this is intentional
            });

            const klip = this._filterKlip(newKlip);
            this._sendResponse(res, MESSAGES.KLIPZ_CREATED, 201, { klip });
        } catch (error) {
            this._sendError(res, error);
        }
    }

    _filterKlip(klip) {
        const { createdAt, updatedAt, isDeleted, __v, ...filteredKlip } = klip._doc;
        return filteredKlip;
    }


    _klipzHasRequiredFields(fields, res) {
        const { content,tags,files } = fields;
        if (!content||!tags||!files) {
            this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
            return false;
        }
        return true;
    }

}
