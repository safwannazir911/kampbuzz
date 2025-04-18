import { ApiResponse } from "../middlewares/index.js";
import { Institution } from "../models/index.js";
import { MESSAGES } from "../utils/index.js";
import { BaseController } from "./_BaseController/_BaseController.js";


export class BaseIndexController extends BaseController {

    constructor() {
        super();
        this.getAllinstitutions = this.getAllinstitutions.bind(this);
        this.searchInstitutions = this.searchInstitutions.bind(this);
    }

    async getAllinstitutions(req, res) {
        try {
            const institutions = await Institution.find({})
                .select("name email phone address followers")
                .populate({
                    path: "institutionAuthor",
                    select: "institutionAuthor authorEmail",
                    populate: {
                        path: "posts",
                        select: "title content files likes",
                    },
                })

            return this._sendResponse(res, MESSAGES.INSTITUTIONS_FETCHED_SUCCESSFULLY, 200, { data: institutions });
        } catch (error) {
            return this._sendError(res, error);
        }

    }

    async searchInstitutions(req, res) {
        const query = req.query.q;

        if (!query) {
            return this._sendResponse(res, 'Query param is required', 400);
        }

        try {
            const results = await this._searchInstitutionsQuery(query);

            return this._sendResponse(res, MESSAGES.INSTITUTIONS_FETCHED_SUCCESSFULLY, 200, { data: results });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async _searchInstitutionsQuery(query) {
        try {
            const results = await Institution.aggregate([
                {
                    $search: {
                        index: "default",
                        text: {
                            query: query,
                            path: {
                                wildcard: "*",
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                    },
                },
            ]);

            return results;
        } catch (error) {
            return [];
        }
    }
}