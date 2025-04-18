import express from 'express';
import {
    AuthorAuthController,
    AuthorPostController,
    protectedAuthorRoutes,
    AuthorKlipzController,
    AuthorFramezController,
    AuthorDashboardController
} from '../controllers/index.js';
import { upload } from "../middlewares/index.js";

const router = express.Router();
const authorAuthController = new AuthorAuthController();
const authorPostController = new AuthorPostController();
const authorKlipzController = new AuthorKlipzController();
const authorFramezController = new AuthorFramezController();
const authorDashboardController = new AuthorDashboardController();


router.post('/login', authorAuthController.loginAuthor);
router.post('/refresh-token', authorAuthController.authorRefreshToken);

router.use(protectedAuthorRoutes);
router.get('/dashboard', authorAuthController.authorDashboard);
router.route('/upload/avatar').post(upload, authorDashboardController.updateAuthorAvatar);
router.route('/update/author').put(authorDashboardController.updateAuthor);

router.route('/publish-post').post(upload, authorPostController.publishPost);
router.route('/update-post/:postId').put(upload, authorPostController.updatePost);
router.route('/delete-post/:postId').delete(authorPostController.deletePost);

router.route('/publish-klipz').post(upload, authorKlipzController.publishKlipz);

router.route('/publish-framez').post(upload, authorFramezController.publishFramez);


export default router;