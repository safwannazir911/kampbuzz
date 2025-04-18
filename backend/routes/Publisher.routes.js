import express from 'express';
import {
    PublisherAuthController,
    PublisherCreateAuthorController,
    PublisherPostController,
    PublisherKlipzController,
    protectedPublisherRoutes,
    PublisherFramezController,
    PublisherDashboardController
} from '../controllers/index.js';
import { upload } from '../middlewares/fileUpload.middleware.js';

const publisherAuthController = new PublisherAuthController();
const publisherCreateAuthorController = new PublisherCreateAuthorController();
const publisherPostController = new PublisherPostController();
const publisherKlipzController = new PublisherKlipzController();
const publisherFramezController = new PublisherFramezController();
const publisherDashboardController = new PublisherDashboardController();



const publisherRoutes = express.Router();

publisherRoutes.post('/login', publisherAuthController.loginPublisher);
publisherRoutes.post('/refresh-token', publisherAuthController.publisherRefreshToken);

publisherRoutes.use(protectedPublisherRoutes);
publisherRoutes.get('/dashboard', publisherAuthController.publisherDashboard);
publisherRoutes.put('/update/publisher', publisherDashboardController.updatePublisher);
publisherRoutes.post('/upload/avatar', upload, publisherDashboardController.uploadPublisherAvatar);

publisherRoutes.post('/create-author', publisherCreateAuthorController.createAuthor);

publisherRoutes.post('/review-post', publisherPostController.reviewPost);
publisherRoutes.delete('/delete-post/:postId', publisherPostController.deleteAuthorsPost);

publisherRoutes.post('/review-klipz', publisherKlipzController.reviewKlipz);
publisherRoutes.delete('/delete-klipz/:klipId', publisherKlipzController.deleteAuthorsKlip);

publisherRoutes.post('/review-framez', publisherFramezController.reviewFramez);
publisherRoutes.delete('/delete-framez/:frameId', publisherFramezController.deleteAuthorsFrame);

export default publisherRoutes;