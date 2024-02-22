import { DbHelper } from "../../db/DbHelper.js";
export async function getPostsFun(_: any, { username }: { username: string }) {
  try {
    // Fetch user posts using the database module function
    const userPosts = await DbHelper.PostNode.FetchUserProfilePosts(username);
    console.log(userPosts);
    return userPosts; 
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
}
export async function getUserProfileFun(_: any, { username }: { username: string }) {
  try {
    // Fetch user posts using the database module function
    const userInfo = await DbHelper.UserNode.FetchUserProfile(username);
    const arr=[userInfo]; // return array is the error
    console.log(arr); // return array is the error
    return arr;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
export function numSevFun() {
  return 7;
}
