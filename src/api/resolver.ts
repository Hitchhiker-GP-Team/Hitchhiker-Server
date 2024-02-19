import { getPostsFun, getUserProfileFun } from "./screens/userProfile.js";

export const resolvers = {
  Query: {
    getProfilePosts: getPostsFun,
    getUserProfile: getUserProfileFun,
  },
};
