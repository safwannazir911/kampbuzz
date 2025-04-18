import express from "express";
import {
  InstitutionController,
  protectedInstitutionRoutes,
} from "../controllers/Institution/Institution.controller.js";
import {
  InstitutionAuthorController,
  InstitutionDashboardController,
  InstitutionPublisherController
} from "../controllers/index.js";
import { upload } from "../middlewares/index.js";

const router = express.Router();

const institutionController = new InstitutionController();
const institutionPublisherController = new InstitutionPublisherController();
const institutionAuthorController = new InstitutionAuthorController();
const institutionDashboardController = new InstitutionDashboardController();

//public routes Institution
router.get("/", (req, res) => {
  res.json({ message: "Welcome to Institution API" });
});
router.route("/register").post(institutionController.createInstitution);
router.route("/login").post(institutionController.loginInstitution);
router.route("/refresh-token").post(institutionController.institutionRefreshToken);
router.route("/find/:institutionId").get(institutionController.getInstById);

//protected routes Institution
router.use(protectedInstitutionRoutes);
router.route("/dashboard").get(institutionController.institutionDashboard);
router.route("/update/profile").put(institutionDashboardController.updateInstitution);
router.route("/upload/avatar").post(upload, institutionDashboardController.uploadInstitutionAvatar);
router.route("/upload/cover-image").post(upload, institutionDashboardController.uploadInstitutionCoverImage);

//Author Routes
router.route("/author/create").post(institutionAuthorController.createInstitutionAuthor);
router.route("/author/update").put(institutionAuthorController.updateInstitutionAuthor);
router.route("/author/delete").delete(institutionAuthorController.deleteInstitutionAuthor);

//publisher Routes
router.route("/publisher/create").post(institutionPublisherController.createInstitutionPublisher);
router.route("/publisher/update").put(institutionPublisherController.updateInstitutionPublisher);
router.route("/publisher/delete").delete(institutionPublisherController.deleteInstitutionPublisher);

// payments Routes
router.route("/payment/create-order").post(institutionController.createOrder);
router.route("/payment/verify").post(institutionController.verifyPayment);

//transfer coins
router.route("/transfer-coins").post(institutionController.transferKCoinsToPublisher);

export default router;