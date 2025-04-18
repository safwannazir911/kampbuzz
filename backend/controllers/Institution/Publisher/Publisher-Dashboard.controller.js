import { PublisherAuthController } from "./PublisherAuth.controller.js";



export class PublisherDashboardController extends PublisherAuthController {

    constructor() {
        super();
        this.updatePublisher = this.updatePublisher.bind(this);
        this.uploadPublisherAvatar = this.uploadPublisherAvatar.bind(this);
    }

    async updatePublisher(req, res) {
        const user = req.user;
        if (!this._isAuthorized(user, "institutionPublisher", res)) return;

        const { name } = req.body;
        try {
            const publisher = await this._updatePublisherData(user._id, { name });

            const newPublisher = await this._filterPublisherData(publisher);

            return this._sendResponse(res, 'Publisher Updated', 200, { publisher: newPublisher });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async uploadPublisherAvatar(req, res) {
        const user = req.user;
        if (!this._isAuthorized(user, "institutionPublisher", res)) return;

        const { files } = req?.files;
        if (!files) {
            return this._sendResponse(res, 'Please upload an image', 400);
        }
        // console.log(files);
        const avatar = files[0].location;
        console.log(avatar);

        try {
            const publisher = await this._updatePublisherData(user._id, { avatar });

            const newPublisher = await this._filterPublisherData(publisher);

            return this._sendResponse(res, 'Publisher Avatar Uploaded Successfully', 200, { publisher: newPublisher });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

}