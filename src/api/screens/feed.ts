import { DbHelper } from "../../db/DbHelper.js";
export async function getFeedFun(_: any, { username }: { username: string }) {
    try {
      // Fetch feed posts using the database module function
      const feedPosts = await DbHelper.PostNode.FetchFollowingsPosts(username);
      console.log(feedPosts);
      return feedPosts; 
    } catch (error) {
      console.error("Error fetching user feed:", error);
      throw error;
    }
  }