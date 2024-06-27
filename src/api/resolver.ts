import { Notification } from "../entities/Notification.js";
import { getPostsFun,getUserJourneys, getFeedFun, getUserProfileFun,addUser,deleteUser,followUser,unfollowUser, archivePost, deleteAllArchivedPosts, deleteAllPosts, deletePost, getArchivedPosts, getCategoryPosts, getLikedPosts, getPlacePosts, getSavedPosts, likePost, savePost, unarchivePost, unlikePost, unsavePost, addPlace, addPlaceToCategory, addPostToPlace, addRatingToPlace, addReviewToPlace, addUserVisitedPlace, deletePlace, addPostToJourney, createJourney, deleteJourney, deletePostFromJourney, fetchJourneyPosts, addReview, deleteReview, fetchPlaceReviews, getReviewsFun, fetchCategoryTree, createCategory, deleteCategory, fetchAllCategories, fetchCategory, updateCategory, createPost, updateUser, updatePlace, addComment, replyComment, likeComment, unLikeComment, deleteComment, updateComment, fetchComment, fetchReplies, SearchPlace, SearchUser, fetchPostComments, subscsribe, getPlaceData, upvoteReview, undoUpvoteReview, downvoteReview, undoDownvoteReview } from "./controllers.js";
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DbHelper } from "../db/DbHelper.js";

export const resolvers = {
  Query: {
    login: async (_: any, { username, password }: { username: string; password: string }) => {
      try {

        console.log(`Logging in user with username : ${username}`);
        
        const user = await DbHelper.UserNode.FindUserByUsername(username);
        console.log(user);
        
        if (!user) {
          console.log('User not found');
          throw new Error('User not found');
        }


        //const isPasswordValid = await bcrypt.compare(password, user.password || '');
        if(password === user.password){
          console.log('succesfull login')
          return user;
        }
        else{
          console.log('Invalid password');
          throw new Error('Invalid password');
        }

        // const token = jwt.sign(
        //   { userId: user.id, email: user.email },
        //   process.env.SECRET_KEY || 'default_secret',
        //   { expiresIn: '15d' }
        // );

      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },
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
    upvoteReview: upvoteReview,
    undoUpvoteReview: undoUpvoteReview,
    downvoteReview: downvoteReview,
    undoDownvoteReview: undoDownvoteReview,
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
    },
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      try {
        console.log(`Logging in user with email: ${email}`);
        const user = await DbHelper.UserNode.FindUserByUsername(email);
        if (!user) {
          console.log('User not found');
          throw new Error('User not found');
        }
  
        const isPasswordValid = await bcrypt.compare(password, user.password || '');
        if (!isPasswordValid) {
          console.log('Invalid password');
          throw new Error('Invalid password');
        }
  
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.SECRET_KEY || 'default_secret',
          { expiresIn: '1h' }
        );
  
        console.log('Login successful, returning token');
        return { token };
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
    },
  },

  Subscription:{
    notificationAdded: {
    subscribe:subscsribe
  },

  },
}
