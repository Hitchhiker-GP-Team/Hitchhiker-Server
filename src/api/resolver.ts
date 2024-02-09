import { DbHelper } from "../db/DbHelper.js";
// Resolvers define how to fetch the types defined in your schema.
export const resolvers = {
  Query: {
    getProfilePosts: async (
      _: any,
      { username }: { username: string },
      context: any
    ) => {
      try {
        // Fetch user posts using the database module function
        const userPosts = await DbHelper.PostNode.fetchUserProfilePosts(
          username
        );
        return userPosts;
      } catch (error) {
        console.error("Error fetching user posts:", error);
        throw error;
      }
    },
  },
};
