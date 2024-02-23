import { getPostsFun, getUserProfileFun, getReviewsFun, getUserJourneys } from "./screens/userProfile.js";

export const resolvers = {
  Query: {
    getProfilePosts: getPostsFun,
    getUserProfile: getUserProfileFun,
    getReviewsFun: getReviewsFun,
    getUserJourneys: getUserJourneys
  },
};
