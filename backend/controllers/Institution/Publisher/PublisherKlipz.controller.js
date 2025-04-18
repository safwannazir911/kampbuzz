import { MESSAGES } from "../../../utils/index.js";
import { BaseController } from "../../_BaseController/_BaseController.js";
import { POST_COST } from "./constants/postCost.js";


export class PublisherKlipzController extends BaseController {
    constructor() {
        super();
        this.reviewKlipz = this.reviewKlipz.bind(this);
        this.deleteAuthorsKlip = this.deleteAuthorsKlip.bind(this);
    }

    async reviewKlipz(req, res) {
        const publisher = req.user;
        if (!this._isAuthorized(publisher, "institutionPublisher", res)) return;

        try {
            const { klipId, status } = req.body;

            if (!this._isValidId(klipId, res)) return;

            const klip = await this._findKlip(klipId);
            console.log(klip)

            if (!klip) {
                return this._sendResponse(res, MESSAGES.KLIP_NOT_FOUND, 404);
            }

            if (!["published", "rejected"].includes(status)) {
                return this._sendResponse(res, MESSAGES.INVALID_STATUS, 400);
            }

            if (status === "published") {
                const deduct = await this._decuctKCoins(POST_COST.KLIPZ, publisher._id);
 
                 if (!deduct) {
                     return;
                 }
             }
            klip.status = status;
            await klip.save();

            return this._sendResponse(res, MESSAGES.KLIP_REVIEWED, 200, { klip });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async deleteAuthorsKlip(req, res) {
        const publisher = req.user;
        const klipId = req.params.klipId;

        if (!this._isAuthorized(publisher, "institutionPublisher", res)) return;

        try {
            if (!this._isValidId(klipId, res)) return;

            const klip = await this._deleteKlipz(klipId);

            if (!klip) {
                return this._sendResponse(res, MESSAGES.KLIP_NOT_FOUND, 404);
            }

            return this._sendResponse(res, MESSAGES.KLIP_DELETED, 200, { klip });
        } catch (error) {
            return this._sendError(res, error);
        }
    }
}