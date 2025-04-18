import { MESSAGES } from "../../utils/index.js";
import { InstitutionController } from "./Institution.controller.js";



export class InstitutionDashboardController extends InstitutionController {
    constructor() {
        super();
        this.updateInstitution = this.updateInstitution.bind(this);
        this.uploadInstitutionAvatar = this.uploadInstitutionAvatar.bind(this);
        this.uploadInstitutionCoverImage = this.uploadInstitutionCoverImage.bind(this);
    }

    async updateInstitution(req, res) {
        const user = req.user;

        if (!this._isAuthorized(user, "institution", res)) return;
        const { name } = req.body;
        try {
            const updatedInstitution = await this._updateInstitutionData(user._id, { name });

            const newInstitution = this._filterInstitutionData(updatedInstitution);

            return this._sendResponse(res, MESSAGES.INSTITUTION_UPDATED, 200, { institution: newInstitution });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async uploadInstitutionAvatar(req, res) {
        const user = req.user;

        if (!this._isAuthorized(user, "institution", res)) return;

        const { files } = req.files;
        if (!files) {
            return this._sendResponse(res, 'Please upload a valid Image', 400);
        }
        const avatar = files[0].location;

        try {
            const updatedInstitution = await this._updateInstitutionData(user._id, { avatar });

            const newInstitution = this._filterInstitutionData(updatedInstitution);

            return this._sendResponse(res, 'Avatar Uploaded Successfully', 200, { institution: newInstitution });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async uploadInstitutionCoverImage(req, res) {
        const user = req.user;

        if (!this._isAuthorized(user, "institution", res)) return;

        const { files } = req.files;
        if (!files) {
            return this._sendResponse(res, 'Please upload a valid cover Image', 400);
        }
        const coverImage = files[0].location;

        try {
            const updatedInstitution = await this._updateInstitutionData(user._id, { coverImage });

            const newInstitution = this._filterInstitutionData(updatedInstitution);

            return this._sendResponse(res, MESSAGES.INSTITUTION_UPDATED, 200, { institution: newInstitution });
        } catch (error) {
            return this._sendError(res, error);
        }
    }
}