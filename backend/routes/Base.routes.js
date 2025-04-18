import express from "express";
import { BaseIndexController } from "../controllers/index.js";

const router = express.Router();
const baseIndexController = new BaseIndexController();

router.route("/all-institutions").get(baseIndexController.getAllinstitutions);
router.route("/search").get(baseIndexController.searchInstitutions);

export default router;