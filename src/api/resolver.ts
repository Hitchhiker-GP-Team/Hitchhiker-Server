
import { fetchUserPosts } from "../db/DbHelper.js";
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers = {
  Query: {
    getProfilePosts: async  (_ : any, { username }: { username: string }, context: any)=> {
      try {
            // Fetch user posts using the database module function
            const userPosts = await fetchUserPosts(username);
            return userPosts;
      } catch (error) {
            console.error('Error fetching user posts:', error);
            throw error;
      }
  },
 
  },
}


