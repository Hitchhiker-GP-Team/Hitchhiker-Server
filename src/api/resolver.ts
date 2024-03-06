import { getPostsFun,getUserJourneys, getFeedFun, getUserProfileFun,addUser,deleteUser,followUser,unfollowUser, archivePost, deleteAllArchivedPosts, deleteAllPosts, deletePost, getArchivedPosts, getCategoryPosts, getLikedPosts, getPlacePosts, getSavedPosts, likePost, savePost, unarchivePost, unlikePost, unsavePost, addPlace, addPlaceToCategory, addPostToPlace, addRatingToPlace, addReviewToPlace, addUserVisitedPlace, deletePlace, addPostToJourney, createJourney, deleteJourney, deletePostFromJourney, fetchJourneyPosts, addReview, deleteReview, fetchPlaceReviews, getReviewsFun, fetchCategoryTree, createCategory, deleteCategory, fetchAllCategories, fetchCategory, updateCategory, createPost, updateUser, updatePlace, addComment, replyComment, likeComment, unLikeComment, deleteComment, updateComment, fetchComment, fetchReplies, searchPlaces, searchUser } from "./screens/userProfile.js";

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
    searchUser: searchUser,
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
    searchPlaces:searchPlaces,
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


    //COMMENT
    addComment: addComment,
    replyComment: replyComment,
    likeComment: likeComment,
    unLikeComment: unLikeComment,
    fetchComment: fetchComment,
    updateComment: updateComment,
    fetchReplies: fetchReplies,
    deleteComment: deleteComment,
    //END COMMENT
  },
}
