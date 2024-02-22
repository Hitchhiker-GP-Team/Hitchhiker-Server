import { dbDriver } from "../dbConnection.js";
import { User } from "../../entities/User.js";
// import { PostNode } from "./PostNode.js";
// import { ReviewNode } from "./ReviewNode.js";

export class UserNode {
  create(user: User): boolean {
    throw new Error("Method not implemented.");
  }
  update(user: User): boolean {
    throw new Error("Method not implemented.");
  }
  delete(primaryKey: string): boolean {
    throw new Error("Method not implemented.");
  }


  public async FetchUserProfile(username: string): Promise<User> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User {username: $username})
        RETURN user.username AS username,
               user.profilePic AS profilePic,
               user.Bio AS bio,
               user.Name AS Name,
               user.followingCntr AS followingCntr,
               user.followersCntr AS followersCntr,
               user.postCntr AS postCntr,
               user.reviewsCntr AS reviewsCntr
        `,
        { username }
      );

      const userData = result.records[0].toObject();

      // Fetch user profile posts
      // const postNode = new PostNode(); 
      //const posts = await postNode.FetchUserProfilePosts(username);

      // Fetch user reviews
      //const reviewNode = new ReviewNode(); 
      //const reviews = await reviewNode.FetchUserReviews(username);

      const userProfile: User = {
        username: userData.username,
        profilePic: userData.profilePic,
        Name: userData.Name,
        Bio: userData.bio,
        followingCntr: parseFloat(userData.followingCntr),
        followersCntr: parseFloat(userData.followersCntr),
        //posts: posts,
        postCntr: parseFloat(userData.postCntr),
        // reviews: reviews,
        reviewsCntr: parseFloat(userData.reviewsCntr),
      };

      return userProfile;
    } catch (err) {
      console.error(`Error fetching user profile: ${err}`);
      throw err;
    }
  }

  public async FollowUser(username: string, userToFollow: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (follower:User {username: $username}),
              (following:User {username: $userToFollow})
      
        CREATE (follower)-[:FOLLOWS]->(following)
        `,
        { username, userToFollow }
      );
    } catch (err) {
      console.error(`Error following user: ${err}`);
      throw err;
    }
  }

  public async UnfollowUser(username: string, userToUnfollow: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
      MATCH (follower:User {username: $username})-[follows:FOLLOWS]->(following:User {username: $userToUnfollow})
      DELETE follows
      `,
        { username, userToUnfollow }
      );
    } catch (err) {
      console.error(`Error unfollowing user: ${err}`);
      throw err;
    }
  }



}
