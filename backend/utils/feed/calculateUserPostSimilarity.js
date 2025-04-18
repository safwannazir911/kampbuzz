import { Student } from "../../models/index.js";

// export async function _calculateUserPostSimilarity(userId, post) {
//     try {
//         const user = await Student.findById(userId).populate('likedPosts');
//         const userLikedPosts = user.likedPosts;

//         if (!userLikedPosts.length || !post.tags.length) {
//             return 0;
//         }

//         const contentSimilarity = userLikedPosts.reduce((sum, likedPost) => {
//             if (!likedPost.tags || !post.tags) return sum;
//             // console.log("likedPost.tags", likedPost.tags);
//             const commonTags = post.tags.filter(tag => likedPost.tags.includes(tag));
//             return sum + (commonTags.length / Math.max(post.tags.length, likedPost.tags.length));
//         }, 0) / Math.max(userLikedPosts.length, 1);

//         const postLikes = post.likes.length;
//         const userLikes = userLikedPosts.length;
//         const commonLikes = post.likes.filter(like => user.likedPosts.some(p => p._id.equals(like))).length;
//         const collaborativeSimilarity = userLikes > 0 ? commonLikes / Math.sqrt(postLikes * userLikes) : 0;

//         return 0.7 * contentSimilarity + 0.3 * collaborativeSimilarity;
//     } catch (error) {
//         console.log("Error in _calculateUserPostSimilarity", error);
//         return 0;
//     }
// }


export async function _calculateUserPostSimilarity(userId, post, followedInstitutionIds) {
    try {
        const user = await Student.findById(userId).populate('likedPosts');
        const userLikedPosts = user.likedPosts;

        const isFromFollowedInstitution = followedInstitutionIds.some(id => 
            id.equals(post.institutionAuthor.institution._id)
        );
        
        const isLikedByUser = user.likedPosts.some(likedPost => likedPost._id.equals(post._id));

        const userLikedTags = new Set(userLikedPosts.flatMap(post => post.tags));
        const commonTags = post.tags.filter(tag => userLikedTags.has(tag));
        const tagSimilarity = post.tags.length > 0 ? commonTags.length / post.tags.length : 0;

        let score = 0;
        if (isFromFollowedInstitution) score += 0.4;
        if (isLikedByUser) score += 0.3;
        score += 0.3 * tagSimilarity;

        return score;
    } catch (error) {
        console.log("Error in _calculateUserPostSimilarity", error);
        return 0;
    }
}