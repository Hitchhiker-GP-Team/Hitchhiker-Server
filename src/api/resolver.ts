import { createCategory, updateCategory, deleteCategory, fetchCategory, fetchAllCategories, fetchCategoryTree } from "./screens/CategoryApi.js";
import { createJourney, getUserJourneys, fetchJourneyPosts, addPostToJourney, deleteJourney, deletePostFromJourney } from "./screens/JourneyApi.js";
import { addPlace, updatePlace, deletePlace, addPostToPlace, addPlaceToCategory, addReviewToPlace, addRatingToPlace, addUserVisitedPlace } from "./screens/PlaceApi.js";
import { getFeedFun, getPostsFun, getSavedPosts, getLikedPosts, getPlacePosts, getCategoryPosts, getArchivedPosts, createPost, likePost, savePost, archivePost, unlikePost, unsavePost, unarchivePost, deletePost, deleteAllPosts, deleteAllArchivedPosts } from "./screens/PostApi.js";
import { getReviewsFun, fetchPlaceReviews, addReview, deleteReview } from "./screens/ReviewApi.js";
import { getUserProfileFun, addUser, updateUser, deleteUser, followUser, unfollowUser } from "./screens/UserApi.js";
import {  replyComment} from "./screens/CommentApi.js";

export const resolvers = {
  Query: {
    // USER NODE
    getUserProfile: getUserProfileFun,
    addUser: addUser,
    updateUser: updateUser,
    //updatebio: updatebio,
    deleteUser: deleteUser,
    followUser: followUser,
    unfollowUser: unfollowUser,
    //END USER

    // POST NODE
    getFeedFun: getFeedFun,
    getPostsFun: getPostsFun,
    getSavedPosts: getSavedPosts,
    getLikedPosts: getLikedPosts,
    getPlacePosts: getPlacePosts,
    getCategoryPosts: getCategoryPosts,
    getArchivedPosts: getArchivedPosts,
    createPost: createPost,
    likePost: likePost,
    savePost: savePost,
    archivePost: archivePost,
    unlikePost: unlikePost,
    unsavePost: unsavePost,
    unarchivePost: unarchivePost,
    deletePost: deletePost,
    deleteAllPosts: deleteAllPosts,
    deleteAllArchivedPosts: deleteAllArchivedPosts,
    //END POST

    //PLACE 
    addPlace: addPlace,
    updatePlace: updatePlace,
    deletePlace: deletePlace,
    addPostToPlace: addPostToPlace,
    addPlaceToCategory: addPlaceToCategory,
    addReviewToPlace: addReviewToPlace,
    addRatingToPlace: addRatingToPlace,
    addUserVisitedPlace: addUserVisitedPlace,
    //END PLACE

    //JOURNEY
    createJourney: createJourney,
    getUserJourneys: getUserJourneys,
    fetchJourneyPosts: fetchJourneyPosts,
    addPostToJourney: addPostToJourney,
    deleteJourney: deleteJourney,
    deletePostFromJourney: deletePostFromJourney,
    //END JOURNEY

    //REVIEW
    getReviewsFun: getReviewsFun,
    fetchPlaceReviews: fetchPlaceReviews,
    addReview: addReview,
    deleteReview: deleteReview,
    //END REVIEW

    //CATEGORY
    createCategory: createCategory,
    updateCategory: updateCategory,
    deleteCategory: deleteCategory,
    fetchCategory: fetchCategory,
    fetchAllCategories: fetchAllCategories,
    fetchCategoryTree: fetchCategoryTree,
    //END CATEGORY


    //Comment
    //replyComment: replyComment,

  },
}
