import { MESSAGES } from "../../../utils/index.js";
import { BaseController } from "../../_BaseController/_BaseController.js";
import schedule from "node-schedule";
import { POST_COST } from "./constants/postCost.js";

export class PublisherFramezController extends BaseController {
    constructor() {
        super();
        this.reviewFramez = this.reviewFramez.bind(this);
        this.deleteAuthorsFrame = this.deleteAuthorsFrame.bind(this);
    }

    async reviewFramez(req, res) {
        const publisher = req.user;
        if (!this._isAuthorized(publisher, "institutionPublisher", res)) return;

        try {
            const { frameId, status } = req.body;

            if (!this._isValidId(frameId, res)) return;

            const frame = await this._findFrame(frameId);
            console.log(frame);

            if (!frame) {
                return this._sendResponse(res, MESSAGES.FRAMEZ_NOT_FOUND, 404);
            }

            if (!["published", "rejected"].includes(status)) {
                return this._sendResponse(res, MESSAGES.INVALID_STATUS, 400);
            }

            if (status === "published") {
                const deduct = await this._decuctKCoins(POST_COST.FRAMEZ, publisher._id);
 
                 if (!deduct) {
                     return;
                 }
             }

            frame.status = status;
            await frame.save();
            // Schedule deletion if status is "published"!
            if (status === "published") {
                const deleteTime = new Date(Date.now() + 30 * 1000);
                schedule.scheduleJob(deleteTime, async () => {
                    await this._deleteFramez(frameId);
                });
            }
            return this._sendResponse(res, MESSAGES.FRAMEZ_REVIEWED, 200, {
                frame,
            });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async deleteAuthorsFrame(req, res) {
        const publisher = req.user;
        const frameId = req.params.frameId;

        if (!this._isAuthorized(publisher, "institutionPublisher", res)) return;

        try {
            if (!this._isValidId(frameId, res)) return;

            const frame = await this._deleteFramez(frameId);

            if (!frame) {
                return this._sendResponse(res, MESSAGES.FRAMEZ_NOT_FOUND, 404);
            }

            return this._sendResponse(res, MESSAGES.FRAME_DELETED, 200, {
                frame,
            });
        } catch (error) {
            return this._sendError(res, error);
        }
    }
}
