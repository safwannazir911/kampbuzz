import { authenticateUser } from "../../middlewares/index.js";
import {
    Framez,
    Institution,
    Klipz,
    Post,
    Student,
} from "../../models/index.js";
import { MESSAGES, _calculateUserPostSimilarity } from "../../utils/index.js";
import { BaseController } from "../_BaseController/_BaseController.js";
import seedrandom from "seedrandom";

export class FeedController extends BaseController {
    constructor() {
        super();
        this.showFeed = this.showFeed.bind(this);
        this.showPost = this.showPost.bind(this);
        this.likePost = this.likePost.bind(this);
        this.followInstitution = this.followInstitution.bind(this);
        this.showKlipz = this.showKlipz.bind(this);
        this.showFramez = this.showFramez.bind(this);
        this.loadDiscoverPosts = this.loadDiscoverPosts.bind(this);
        this.getPostsWithMaxLikes = this.getPostsWithMaxLikes.bind(this);
        this.bookmarkPost = this.bookmarkPost.bind(this);
    }

    async getPaginatedPosts(req, res, statusFilter) {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 12;
            const seed = req.query.seed || Date.now();
            const excludedPostIds = req.query.excludedPostIds ? JSON.parse(req.query.excludedPostIds) : [];

            const totalPosts = await Post.countDocuments({
                ...statusFilter,
                _id: { $nin: excludedPostIds },
            });

            const totalPages = Math.ceil(totalPosts / pageSize);

            const posts = await Post.find({
                ...statusFilter,
                _id: { $nin: excludedPostIds },
            })
                .sort({ createdAt: -1 })
                .populate({
                    path: "institutionAuthor",
                    select: "institutionAuthor",
                    populate: {
                        path: "institution",
                        select: "name email avatar followers",
                    },
                })
                .select("-__v -isDeleted");

            const shuffledPosts = this._shuffle(posts, seed);

            const paginatedPosts = shuffledPosts.slice(
                (page - 1) * pageSize,
                page * pageSize,
            );

            return this._sendResponse(res, MESSAGES.POSTS_FETCHED, 200, {
                posts: paginatedPosts,
                currentPage: page,
                totalPages: totalPages,
                totalPosts: totalPosts,
                seed: seed,
            });
        } catch (error) {
            console.log("Error in getPaginatedPosts", error);
            return this._sendError(res, error);
        }
    }

    async loadDiscoverPosts(req, res) {
        await this.getPaginatedPosts(req, res, { status: "published" });
    }

    async getFollowedInstitutionPosts(institutions, limit = 6) {
        try {
            const posts = await Post.find({
                institutionAuthor: { $in: institutions },
                status: "published",
            })
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate({
                    path: "institutionAuthor",
                    select: "institutionAuthor",
                    populate: {
                        path: "institution",
                        select: "name email avatar followers",
                    },
                })
                .select("-__v -isDeleted");

            return posts;
        } catch (error) {
            console.log("Error in getFollowedInstitutionPosts", error);
            throw error;
        }
    }

    async getRandomPosts(limit = 6) {
        try {
            const posts = await Post.find({ status: "published" })
                .sort({ createdAt: -1 })
                .populate({
                    path: "institutionAuthor",
                    select: "institutionAuthor",
                    populate: {
                        path: "institution",
                        select: "name email avatar followers",
                    },
                })
                .select("-__v -isDeleted");

            const seed = Date.now();
            const shuffledPosts = this._shuffle(posts, seed);

            return shuffledPosts.slice(0, limit);
        } catch (error) {
            console.log("Error in getRandomPosts", error);
            throw error;
        }
    }

    async showFeed(req, res) {
        try {
            const userId = req.user._id;
            const student = await Student.findById(userId).select("following likedPosts");
            const followedInstitutionIds = student.following;

            // console.log("followedInstitutionIds", followedInstitutionIds);

            let posts = [];

            if (followedInstitutionIds.length > 0) {
                const institutionPosts = await this.getFollowedInstitutionPosts(followedInstitutionIds, 10);
                posts = posts.concat(institutionPosts);
            }

            const randomPosts = await this.getRandomPosts(20);
            posts = [...posts, ...randomPosts];

            const postsWithScores = await Promise.all(posts.map(async (post) => {
                const similarityScore = await _calculateUserPostSimilarity(userId, post, followedInstitutionIds);
                return { post, similarityScore: isNaN(similarityScore) ? 0 : similarityScore };
            }));

            // console.log("postsWithScores", postsWithScores);

            postsWithScores.sort((a, b) => b.similarityScore - a.similarityScore);

            const personalizedFeed = postsWithScores.slice(0, 12).map(item => item.post);

            return this._sendResponse(res, MESSAGES.POSTS_FETCHED, 200, {
                posts: personalizedFeed,
            });
        } catch (error) {
            console.log("Error in showFeed", error);
            return this._sendError(res, error);
        }
    }

    async getPostsWithMaxLikes(req, res) {
        try {
            const posts = await Post.find({
                status: "published",
            })
                .sort({ createdAt: -1 })
                .populate({
                    path: "institutionAuthor",
                    select: "institutionAuthor",
                    populate: {
                        path: "institution",
                        select: "name email avatar followers",
                    },
                })
                .select("-__v -isDeleted");

            return this._sendResponse(res, MESSAGES.POSTS_FETCHED, 200, {
                posts,
            });
        } catch (error) {
            console.log("Error in showFeed", error);
            return this._sendError(res, error);
        }
    }

    async showKlipz(req, res) {
        try {
            const klipz = await Klipz.find({
                // status: "published",
            })
                .sort({ createdAt: -1 })
                .populate({
                    path: "institutionAuthor",
                    select: "institutionAuthor",
                    populate: {
                        path: "institution",
                        select: "name email avatar",
                    },
                })
                .select("-__v -isDeleted");

            return this._sendResponse(res, MESSAGES.KLIPZ_FETCHED, 200, {
                klipz,
            });
        } catch (error) {
            console.log("Error in showFeed", error);
            return this._sendError(res, error);
        }
    }
    async showFramez(req, res) {
        const userId = req.user._id;
        try {
            // Find the student by ID
            const student = await Student.findById(userId).populate(
                "following",
            );
            if (!student) {
                return this._sendResponse(res, MESSAGES.STUDENT_NOT_FOUND, 404);
            }

            const followingInstitutionIds = student.following.map(
                (inst) => inst._id,
            );

            const institutions = await Institution.find({
                _id: { $in: followingInstitutionIds },
            })
                .populate({
                    path: "institutionAuthor",
                    populate: {
                        path: "framez",
                        match: { status: "published" }, // Only get published framez
                        select: "files status",
                    },
                })
                .select("name avatar");

            // Extract and filter framez data
            const framezGroupedByInstitution = institutions.map((inst) => ({
                institutionId: inst._id,
                institutionName: inst.name,
                institutionAvatar: inst.avatar,
                framez: inst.institutionAuthor
                    .flatMap((author) => author.framez)
                    .filter((frame) => frame.files.length > 0), // Only include framez with at least 1 file
            }));

            // Remove institutions with no valid framez
            const filteredFramez = framezGroupedByInstitution.filter(
                (inst) => inst.framez.length > 0,
            );

            return this._sendResponse(
                res,
                MESSAGES.INSTITUTIONS_FETCHED_SUCCESSFULLY,
                200,
                { framez: filteredFramez },
            );
        } catch (error) {
            console.log("Error in showFramez", error);
            return this._sendError(res, error);
        }
    }

    async showPost(req, res) {
        const id = req.params.postId;

        if (!this._isValidId(id, res)) return;

        try {
            const post = await Post.findById(id)
                .populate({
                    path: "institutionAuthor",
                    select: "institutionAuthor",
                    populate: {
                        path: "institution",
                        select: "name email avatar",
                    },
                })
                .select("-__v -isDeleted");

            if (!post) {
                return this._sendResponse(res, MESSAGES.POST_NOT_FOUND, 404);
            }

            return this._sendResponse(res, MESSAGES.POSTS_FETCHED, 200, {
                post,
            });
        } catch (error) {
            console.log("Error in showPost", error);
            return this._sendError(res, error);
        }
    }

    async likePost(req, res) {
        const id = req.params.postId;
        const userId = req.user._id;

        if (!this._isValidId(id, res) || !this._isValidId(userId, res)) return;

        try {
            const post = await Post.findById(id);
            const student = await this._findStudentById(userId);

            if (!post) {
                return this._sendResponse(res, MESSAGES.POST_NOT_FOUND, 404);
            }

            this._toggleLike(post, userId);
            this._togggleLikedPost(student, post._id);

            await post.save();
            await student.save();

            return this._sendResponse(res, MESSAGES.POST_LIKED, 200, { post });
        } catch (error) {
            console.log("Error in likePost", error);
            return this._sendError(res, error);
        }
    }

    async _togggleLikedPost(student, postId) {
        if (student.likedPosts.includes(postId)) {
            student.likedPosts = student.likedPosts.filter(
                (like) => like.toString() !== postId.toString(),
            );
        } else {
            student.likedPosts.push(postId);
        }
    }

    async bookmarkPost(req, res) {
        const postId = req.params.postId;
        const userId = req.user._id;

        if (!this._isValidId(postId, res) || !this._isValidId(userId, res))
            return;

        try {
            const student = await Student.findById(userId);

            if (!student) {
                return this._sendResponse(res, MESSAGES.USER_NOT_FOUND, 404);
            }

            this._toggleBookmark(student, postId);

            await student.save();

            return this._sendResponse(res, MESSAGES.POST_BOOKMARKED, 200, {
                bookmarks: student.bookmarks,
            });
        } catch (error) {
            console.log("Error in bookmarkPost", error);
            return this._sendError(res, error);
        }
    }

    async followInstitution(req, res) {
        const id = req.params.institutionId;
        const user = req.user;

        if (!this._isValidId(id, res)) return;

        // Only students can follow institutions
        if (!user._id || user.userType !== "student") {
            return this._sendResponse(
                res,
                "You cannot follow the institution",
                401,
            );
        }

        try {
            const institution = await this._findInstitution(id);
            const student = await this._findStudentById(user._id);

            if (!institution) {
                return this._sendResponse(
                    res,
                    MESSAGES.INSTITUTION_NOT_FOUND,
                    404,
                );
            }

            // Toggle follow status for institution
            this._toggleFollow(institution, user._id);
            this._toggleFollowing(student, institution._id);

            // Save institution document
            await institution.save();
            await student.save();

            const newInstitution = this._filterInstitutionData(institution);

            const message = institution.followers.includes(user._id)
                ? "Followed Successfully"
                : "Unfollowed Successfully";
            return this._sendResponse(res, message, 200, {
                institution: newInstitution,
            });
        } catch (error) {
            console.log("Error in followInstitution", error);
            return this._sendError(res, error);
        }
    }

    async _toggleStudentFollow(userId, institutionId) {
        try {
            const student = await Student.findById(userId);
            if (!student) throw new Error("Student not found");
            if (student.following.includes(institutionId)) {
                // Remove the institution from the following list if it's already followed
                student.following = student.following.filter(
                    (id) => id.toString() !== institutionId.toString(),
                );
            } else {
                // Add the institution to the following list if it's not followed
                student.following.push(institutionId);
            }

            await student.save();
            return student;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    _toggleLike(post, userId) {
        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(
                (like) => like.toString() !== userId.toString(),
            );
        } else {
            post.likes.push(userId);
        }
    }
    _toggleBookmark(student, userId) {
        if (student.bookmarks.includes(userId)) {
            student.bookmarks = student.bookmarks.filter(
                (like) => like.toString() !== userId.toString(),
            );
        } else {
            student.bookmarks.push(userId);
        }
    }

    _toggleFollow(institution, userId) {
        if (institution.followers.includes(userId)) {
            institution.followers = institution.followers.filter(
                (follower) => follower.toString() !== userId.toString(),
            );
        } else {
            institution.followers.push(userId);
        }
    }

    _toggleFollowing(student, institutionId) {
        if (student.following.includes(institutionId)) {
            student.following = student.following.filter(
                (follow) => follow.toString() !== institutionId.toString(),
            );
        } else {
            student.following.push(institutionId);
        }
    }

    _filterInstitutionData(institution) {
        return {
            _id: institution._id,
            name: institution.name,
            avatar: institution.avatar,
            address: institution.address,
            email: institution.email,
            followers: institution.followers.length,
            following: institution.followers,
        };
    }

    _shuffle(array, seed) {
        let rng = seedrandom(seed);
        let shuffledArray = array.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [
                shuffledArray[j],
                shuffledArray[i],
            ];
        }
        return shuffledArray;
    }
}

export const protectedFeedRoutes = [authenticateUser];
