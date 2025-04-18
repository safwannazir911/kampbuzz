import { Post } from "../../../models/index.js";
import { MESSAGES } from "../../../utils/index.js";
import { BaseController } from "../../_BaseController/_BaseController.js";

export class AuthorPostController extends BaseController {
    constructor() {
        super();
        this.publishPost = this.publishPost.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.deletePost = this.deletePost.bind(this);
    }

    async publishPost(req, res) {
        const author = req.user;

        if (!this._isAuthorized(author, "institutionAuthor", res)) return;

        const { title, content, tags } = req.body;
        const { files } = req.files;

        // console.log("files", files);

        if (!this._hasRequiredFields({ title, content, files }, res)) return;

        let fileLocations = [];
        if (files) {
            fileLocations = [...fileLocations, ...files.map((f) => f.location)];
        }

        try {
            const newPost = await Post.create({
                title,
                content,
                tags,
                files: fileLocations,
                postAuthor: author._id,
                institutionAuthor: author._id, // Assuming this is intentional
            });

            const post = this._filterPost(newPost);
            this._sendResponse(res, MESSAGES.POST_CREATED, 201, { post });
        } catch (error) {
            this._sendError(res, error);
        }
    }

    ///TODO: Need to implement the new route for removing the file from the post while Updating the post
    /// because if the post is updated in order to remove file. that is not implemented yet.
    async updatePost(req, res) {
        const author = req.user;
        const postId = req.params.postId;

        if (!this._isAuthorized(author, "institutionAuthor", res)) return;
        if (!this._isValidId(postId, res)) return;

        const { title, content, tags } = req.body;

        const file = req?.file;
        const fileUrl = file?.location;

        const updateFields = this._getUpdateFields({
            title,
            content,
            tags,
            fileUrl,
        });

        try {
            const existingPost = this._findPost(postId);
            if (!existingPost) {
                this._sendResponse(res, MESSAGES.POST_NOT_FOUND, 404);
                return;
            }
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                updateFields,
                { new: true },
            );

            if (!updatedPost) {
                this._sendResponse(res, MESSAGES.POST_NOT_FOUND, 404);
                return;
            }

            const post = this._filterPost(updatedPost);
            this._sendResponse(res, MESSAGES.POST_UPDATED, 200, { post });
        } catch (error) {
            this._sendError(res, error);
        }
    }

    async deletePost(req, res) {
        const author = req.user;
        const postId = req.params.postId;

        if (!this._isAuthorized(author, "institutionAuthor", res)) return;
        if (!this._isValidId(postId, res)) return;

        try {
            const deletedPost = await Post.findByIdAndDelete(postId);

            if (!deletedPost) {
                this._sendResponse(res, MESSAGES.POST_NOT_FOUND, 404);
                return;
            }

            // this._deleteFiles(deletedPost.files);

            this._sendResponse(res, MESSAGES.POST_DELETED, 200, {
                deletedPost: {
                    title: deletedPost.title,
                    content: deletedPost.content,
                    files: deletedPost.files,
                    tags: deletedPost.tags,
                    likes: deletedPost.likes,
                },
            });
        } catch (error) {
            this._sendError(res, error);
        }
    }

    _filterPost(post) {
        const { createdAt, updatedAt, isDeleted, __v, ...filteredPost } =
            post._doc;
        return filteredPost;
    }

    _hasRequiredFields(fields, res) {
        const { title, content, files } = fields;
        if (!title || (!content && !files)) {
            this._sendResponse(res, MESSAGES.MISSING_FIELDS, 400);
            return false;
        }
        return true;
    }

    _getUpdateFields(fields) {
        const { title, content, tags, fileUrl } = fields;
        const updateFields = {};

        if (title) updateFields.title = title;
        if (content) updateFields.content = content;
        if (tags) updateFields.tags = tags;
        if (fileUrl) updateFields.files = fileUrl;

        return updateFields;
    }

    ///TODO: This was used for the local storage of files. Need to implement the S3 bucket for the same.
    /// may be we could modify this function to delete the file from S3 bucket.
    // _deleteFiles(files) {
    //     if (files && Array.isArray(files) && files.length > 0) {
    //         files.forEach(file => {
    //             const filePath = path.join(env.UPLOADS_DIR, file);
    //             if (fs.existsSync(filePath)) {
    //                 fs.unlinkSync(filePath);
    //             }
    //         });
    //     }
    // }
}
