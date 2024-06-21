import { Notification } from "../entities/Notification.js";
import { getPostsFun,getUserJourneys, getFeedFun, getUserProfileFun,addUser,deleteUser,followUser,unfollowUser, archivePost, deleteAllArchivedPosts, deleteAllPosts, deletePost, getArchivedPosts, getCategoryPosts, getLikedPosts, getPlacePosts, getSavedPosts, likePost, savePost, unarchivePost, unlikePost, unsavePost, addPlace, addPlaceToCategory, addPostToPlace, addRatingToPlace, addReviewToPlace, addUserVisitedPlace, deletePlace, addPostToJourney, createJourney, deleteJourney, deletePostFromJourney, fetchJourneyPosts, addReview, deleteReview, fetchPlaceReviews, getReviewsFun, fetchCategoryTree, createCategory, deleteCategory, fetchAllCategories, fetchCategory, updateCategory, createPost, updateUser, updatePlace, addComment, replyComment, likeComment, unLikeComment, deleteComment, updateComment, fetchComment, fetchReplies, SearchPlace, SearchUser, fetchPostComments, subscsribe, getPlaceData } from "./screens/userProfile.js";
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const resolvers = {
  Query: {

    // Notification
    notifications: async (_:any,{username}: {username:String})=>
      {
      const notifications: Notification[] = [];
      const noti: Notification = {
        
      }
      notifications.push(noti);
      return notifications;
    },


    // USER NODE
    getUserProfile: getUserProfileFun,
    addUser: addUser,
    updateUser: updateUser,
    //updatebio: updatebio,
    deleteUser: deleteUser,
    followUser: followUser,
    unfollowUser: unfollowUser,
    SearchUser: SearchUser,
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
    SearchPlace:SearchPlace,
    getPlaceData:getPlaceData,
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
    getPostComments : fetchPostComments
    //END COMMENT
  },
  Mutation:{
    createNotification : async (_:any, {username,message}:{username:String,message:String} )=>{
        const noti : Notification = {
        }
        pubsub.publish('NOTIFICATION_ADDED',{notificationAdded: noti});
        return noti;
    }
  },

  Subscription:{
    notificationAdded: {
    subscribe:subscsribe
  },

  },
}
