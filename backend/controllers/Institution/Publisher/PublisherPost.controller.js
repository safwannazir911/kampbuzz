import { InstitutionPublisher } from "../../../models/index.js";
import { MESSAGES } from "../../../utils/index.js";
import { BaseController } from "../../_BaseController/_BaseController.js";
import { POST_COST } from "./constants/postCost.js";


export class PublisherPostController extends BaseController {
    constructor() {
        super();
        this.reviewPost = this.reviewPost.bind(this);
        this.deleteAuthorsPost = this.deleteAuthorsPost.bind(this);
    }

    async reviewPost(req, res) {
        const publisher = req.user;

        if (!this._isAuthorized(publisher, "institutionPublisher", res)) return;

        try {
            const { postId, status } = req.body;

            if (!this._isValidId(postId, res)) return;

            const post = await this._findPost(postId);

            if (!post) {
                return this._sendResponse(res, MESSAGES.POST_NOT_FOUND, 404);
            }

            if (!["published", "rejected"].includes(status)) {
                return this._sendResponse(res, MESSAGES.INVALID_STATUS, 400);
            }

            if (status === "published") {
               const deduct = await this._decuctKCoins(POST_COST.POST, publisher._id);

                if (!deduct) {
                    return;
                }
            }

            post.status = status;
            await post.save();

            return this._sendResponse(res, MESSAGES.POST_REVIEWED, 200, { post });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async deleteAuthorsPost(req, res) {
        const publisher = req.user;
        const postId = req.params.postId;

        if (!this._isAuthorized(publisher, "institutionPublisher", res)) return;

        try {
            if (!this._isValidId(postId, res)) return;

            const post = await this._deletePost(postId);

            if (!post) {
                return this._sendResponse(res, MESSAGES.POST_NOT_FOUND, 404);
            }

            return this._sendResponse(res, MESSAGES.POST_DELETED, 200, { post });
        } catch (error) {
            return this._sendError(res, error);
        }
    }
}