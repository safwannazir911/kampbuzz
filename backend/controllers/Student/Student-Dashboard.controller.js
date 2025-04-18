import { MESSAGES } from "../../utils/index.js";
import { StudentController } from "./Student.controller.js";



export class StudentDashboardController extends StudentController {

    constructor() {
        super();
        this.uploadProfilePicture = this.uploadProfilePicture.bind(this);
    }

    async uploadProfilePicture(req, res) {
        const user = req.user;
        if (!this._isAuthorized(user, "student", res)) return;

        const { files } = req?.files;
        if (!files) {
            return this._sendResponse(res, 'Please upload a valid avatar', 404);
        }
        const avatar = files[0]?.location;
        // console.log(avatar);

        try {
            const student = await this._findStudentById(user.id);
            if (!student) {
                return this._sendResponse(res, MESSAGES.STUDENT_NOT_FOUND, 404);
            }

            student.avatar = avatar;
            await student.save();
            const studentData = this._filterStudentData(student);
            return this._sendResponse(res, 'Avatar Uploaded Successfully', 200, { studentData });
        } catch (error) {
            return this._sendError(res, error);
        }
    }
}