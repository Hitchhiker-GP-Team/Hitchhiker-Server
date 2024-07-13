import { DbHelper } from "../db/DbHelper.js";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  fetchCategory,
  fetchAllCategories,
  fetchCategoryTree,
  SearchCategory,
} from "./controllers/category.js";

import {
  GetFollowersList,
  GetFollowingList,
  addUser,
  deleteUser,
  followUser,
  getUserNotifications,
  getUserProfileFun,
  updateUser,
  unfollowUser,
  SearchUser,
  leaderBoard,
  GetUsersLikedPost,
} from "./controllers/user.js";
import {
  fetchPostById,
  getFeedFun,
  getLikedPosts,
  getPostsFun,
  getSavedPosts,
  getPlacePosts,
  getCategoryPosts,
  getArchivedPosts,
  createPost,
  likePost,
  savePost,
  archivePost,
  unlikePost,
  unsavePost,
  unarchivePost,
  deletePost,
  deleteAllPosts,
  deleteAllArchivedPosts,
  subscsribe,
} from "./controllers/post.js";
import {
  addPlace,
  addPostToPlace,
  deletePlace,
  updatePlace,
  addPlaceToCategory,
  addReviewToPlace,
  addRatingToPlace,
  addUserVisitedPlace,
  SearchPlace,
  getPlaceData,
} from "./controllers/place.js";
import {
  addPostToJourney,
  createJourney,
  deleteJourney,
  deletePostFromJourney,
  fetchJourneyPosts,
  getUserJourneys,
} from "./controllers/journey.js";
import {
  addReview,
  deleteReview,
  fetchPlaceReviews,
  getReviewsFun,
  downvoteReview,
  undoDownvoteReview,
  undoUpvoteReview,
  upvoteReview,
} from "./controllers/review.js";
import {
  addComment,
  likeComment,
  replyComment,
  unLikeComment,
  fetchComment,
  fetchReplies,
  updateComment,
  deleteComment,
  fetchPostComments,
} from "./controllers/comment.js";
import { Notification } from "../entities/Notification.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    login: async (
      _: any,
      { username, password }: { username: string; password: string }
    ) => {
      try {
        console.log(`Logging in user with username : ${username}`);

        const user = await DbHelper.UserNode.FindUserByUsername(username);
        console.log(user);

        if (!user) {
          console.log("User not found");
          throw new Error("User not found");
        }

        if (password === user.password) {
          console.log("succesfull login");
          return user;
        } else {
          console.log("Invalid password");
          throw new Error("Invalid password");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        throw error;
      }
    },
    // Notification
    notifications: async (_: any, { username }: { username: String }) => {
      const notifications: Notification[] = [];
      const noti: Notification = {};
      notifications.push(noti);
      return notifications;
    },

    //NOTIFICATION
    getNoty: getUserNotifications,

    // USER
    getUserProfile: getUserProfileFun,
    addUser: addUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    followUser: followUser,
    GetFollowingList: GetFollowingList,
    GetFollowersList: GetFollowersList,
    unfollowUser: unfollowUser,
    SearchUser: SearchUser,
    leaderBoard: leaderBoard,
    //END USER

    // POST
    fetchPostById: fetchPostById,
    getFeedFun: getFeedFun,
    getPostsFun: getPostsFun,
    getSavedPosts: getSavedPosts,
    getLikedPosts: getLikedPosts,
    GetUsersLikedPost: GetUsersLikedPost,
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
    SearchPlace: SearchPlace,
    getPlaceData: getPlaceData,
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
    SearchCategory: SearchCategory,

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
    getPostComments: fetchPostComments,
    //END COMMENT
  },
  Mutation: {
    createNotification: async (
      _: any,
      { username, message }: { username: String; message: String }
    ) => {
      const noti: Notification = {};
      pubsub.publish("NOTIFICATION_ADDED", { notificationAdded: noti });
      return noti;
    },
    login: async (
      _: any,
      { email, password }: { email: string; password: string }
    ) => {
      try {
        console.log(`Logging in user with email: ${email}`);
        const user = await DbHelper.UserNode.FindUserByUsername(email);
        if (!user) {
          console.log("User not found");
          throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.password || ""
        );
        if (!isPasswordValid) {
          console.log("Invalid password");
          throw new Error("Invalid password");
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.SECRET_KEY || "default_secret",
          { expiresIn: "1h" }
        );

        console.log("Login successful, returning token");
        return { token };
      } catch (error) {
        console.error("Error logging in:", error);
        throw error;
      }
    },
  },

  Subscription: {
    notificationAdded: {
      subscribe: subscsribe,
    },
  },
};
