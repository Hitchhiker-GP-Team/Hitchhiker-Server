import { getFeedFun } from "./screens/feed.js";
import { getPostsFun, getUserProfileFun, getReviewsFun, getUserJourneys, } from "./screens/userProfile.js";

export const resolvers = {
  Query: {
    getProfilePosts: getPostsFun,
    getUserProfile: getUserProfileFun,
    getReviewsFun: getReviewsFun,
    getUserJourneys: getUserJourneys,
    getFeedFun: getFeedFun
  },
};
