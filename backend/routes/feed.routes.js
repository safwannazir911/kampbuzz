import express from "express";
import { FeedController, protectedFeedRoutes } from "../controllers/index.js";

const router = express.Router();
const feedController = new FeedController();

router.use(protectedFeedRoutes);
router.route("/").get(feedController.showFeed);
router.route("/:postId").get(feedController.showPost);

router.route("/klipz/all").get(feedController.showKlipz);

router.route("/discover/all").get(feedController.loadDiscoverPosts);

router.route("/:postId/like").post(feedController.likePost);

router.route("/:postId/bookmark").post(feedController.bookmarkPost);

router.route("/follow/:institutionId").post(feedController.followInstitution);

router.route("/max/likes").get(feedController.getPostsWithMaxLikes);

router.route("/framez/all").get(feedController.showFramez);

export default router;
