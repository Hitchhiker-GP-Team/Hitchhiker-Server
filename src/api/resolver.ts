import { getPostsFun } from "./screens/userProfile.js";

export const resolvers = {
  Query: {
    getProfilePosts: getPostsFun,
  },
};
