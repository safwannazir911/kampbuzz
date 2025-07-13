import express from "express";
import {
  StudentController,
  StudentDashboardController,
  protectedStudentRoutes,
} from "../controllers/index.js";
import { upload } from "../middlewares/fileUpload.middleware.js";

const router = express.Router();

const studentController = new StudentController();
const studentDashboardController = new StudentDashboardController();

//public routes
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Student API" });
});

//public routes
router.route("/register").post(studentController.createStudent);
router.route("/login").post(studentController.loginStudent);
router.route("/refresh-token").post(studentController.refreshToken);
router.route("/verify").post(studentController.verifyOTP);
router.route("/resendOTP").post(studentController.resendOTP);
router.route("/resetPassword").post(studentController.requestPasswordReset);
router.route("/forgotPassword").post(studentController.forgotPassword)
router.route("/sendOTP").post(studentController.sendOTP)


//protected routes
router.use(protectedStudentRoutes);
router.route("/dashboard").get(studentController.studentDashboard);
router.route("/update").post(upload, studentController.updateStudent);
router.route("/upload/avatar").post(upload, studentDashboardController.uploadProfilePicture);

router.route("/author-status").post(upload, studentController.createAuthorRequest);


export default router;
