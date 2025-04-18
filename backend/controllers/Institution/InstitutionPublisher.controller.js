import { Institution, InstitutionPublisher } from "../../models/index.js";
import { MESSAGES } from "../../utils/index.js";
import { BaseController } from "../_BaseController/_BaseController.js";

export class InstitutionPublisherController extends BaseController {
    constructor() {
        super();
        this.createInstitutionPublisher = this.createInstitutionPublisher.bind(this);
        this.updateInstitutionPublisher = this.updateInstitutionPublisher.bind(this);
        this.deleteInstitutionPublisher = this.deleteInstitutionPublisher.bind(this);
    }

    async createInstitutionPublisher(req, res) {
        const institutionId = req.user._id;
    
        if (!institutionId) {
            return this._sendResponse(res, MESSAGES.UNAUTHORIZED_ACCESS, 401);
        }
    
        const { name, email, phone, password, address } = req.body;
    
        if (!name || !email || !phone || !password || !address) {
            return this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
        }
    
        try {
            const institution = await this._findInstitution(institutionId, res);
            if (!institution) return;
    
            const [isPublisherExists, isPublisherPhoneExists] = await Promise.all([
                InstitutionPublisher.findOne({ email }),
                InstitutionPublisher.findOne({ phone })
            ]);
    
            if (isPublisherExists) {
                return this._sendResponse(res, MESSAGES.PUBLISHER_EMAIL_ALREADY_EXISTS, 400);
            }
            
            if (isPublisherPhoneExists) {
                return this._sendResponse(res, MESSAGES.PUBLISHER_PHONE_ALREADY_EXISTS, 400);
            }
    
            const hashedPassword = await this._hashPassword(password);
    
            const publisher = await InstitutionPublisher.create({
                name,
                email,
                phone,
                password: hashedPassword,
                address,
                institution: institutionId,
            });
    
            const newPublisher = this._filterPublisherData(publisher);
    
            return this._sendResponse(res, MESSAGES.PUBLISHER_CREATED_SUCCESSFULLY, 201, { publisher: newPublisher });
        } catch (error) {
            return this._sendError(res, error);
        }
    }
    

    async updateInstitutionPublisher(req, res) {
        const institutionId = req.user._id;

        if (!institutionId) {
            return this._sendResponse(res, MESSAGES.UNAUTHORIZED_ACCESS, 401);
        }

        const { publisherId, name, email, phone, address, password } = req.body;

        if (!publisherId) {
            return this._sendResponse(res, 'Publisher ID is required', 400);
        }

        try {
            const institution = await this._findInstitution(institutionId, res);
            if (!institution) return;

            const publisher = await this._findPublisher(publisherId, res);
            if (!publisher) return;

            if (email && email !== publisher.email) {
                const isEmailExists = await InstitutionPublisher.findOne({ email });
                if (isEmailExists) {
                    return this._sendResponse(res, MESSAGES.PUBLISHER_EMAIL_ALREADY_EXISTS, 400);
                }
                publisher.email = email;
            }

            if (name) publisher.name = name;
            if (phone) publisher.phone = phone;
            if (address) publisher.address = address;
            if (password) publisher.password = await this._hashPassword(password);

            await publisher.save();

            const newPublisher = this._filterPublisherData(publisher);

            return this._sendResponse(res, MESSAGES.PUBLISHER_UPDATED_SUCCESSFULLY, 200, { publisher: newPublisher });
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async deleteInstitutionPublisher(req, res) {
        const institutionId = req.user._id;

        if (!institutionId) {
            return this._sendResponse(res, MESSAGES.UNAUTHORIZED_ACCESS, 401);
        }

        const { publisherId } = req.body;

        if (!publisherId) {
            return this._sendResponse(res, 'Publisher ID is required', 400);
        }

        try {
            const institution = await this._findInstitution(institutionId, res);
            if (!institution) return;

            const publisher = await this._findPublisher(publisherId, res);
            if (!publisher) return;

            await InstitutionPublisher.deleteOne({ _id: publisherId });
            publisher.isDeleted = true;

            institution.institutionPublisher = institution.institutionPublisher.filter(pub => pub.toString() !== publisherId);
            await institution.save();

            return this._sendResponse(res, MESSAGES.PUBLISHER_DELETED_SUCCESSFULLY, 200);
        } catch (error) {
            return this._sendError(res, error);
        }
    }

    async _findPublisher(publisherId, res) {
        const publisher = await InstitutionPublisher.findById(publisherId);
        if (!publisher) {
            this._sendResponse(res, MESSAGES.PUBLISHER_NOT_FOUND, 404);
            return null;
        }
        return publisher;
    }

    _filterPublisherData(publisher) {
        const { password, isDeleted, createdAt, updatedAt, ...newPublisher } = publisher._doc;
        return newPublisher;
    }

    async _findInstitution(institutionId, res) {
        const institution = await Institution.findById(institutionId);
        if (!institution) {
            this._sendResponse(res, MESSAGES.INSTITUTION_NOT_FOUND, 404);
            return null;
        }
        return institution;
    }
}
