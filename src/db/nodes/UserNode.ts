import { dbDriver } from "../dbConnection.js";
import { User } from "../../entities/User.js";
// import { PostNode } from "./PostNode.js";
// import { ReviewNode } from "./ReviewNode.js";

export class UserNode {
  // public async AddUser(user: User): Promise<User> {
  //   try {
  //     // Assuming 'user.id' is already set before calling this method
  //     const driver = dbDriver;
  //     const result = await driver.executeQuery(
  //       `
  //       CREATE (user:User {
  //         username: $username,
  //         profilePic: $profilePic,
  //         email: $email,
  //         password: $password,
  //         Name: $name,
  //         birthDate: $birthDate,
  //         homeLocation: $homeLocation,
  //         sex: $sex,
  //         Bio: $bio,
  //         followingCntr: $followingCntr,
  //         followersCntr: $followersCntr,
  //         postCntr: $postCntr,
  //         reviewsCntr: $reviewsCntr
  //       })
  //       RETURN user
  //       `,
  //       {
  //         username: user.username,
  //         profilePic: user.profilePic,
  //         email: user.email,
  //         password: user.password,
  //         name: user.Name,
  //         birthDate: user.birthDate,
  //         homeLocation: user.homeLocation,
  //         sex: user.sex,
  //         bio: user.Bio,
  //         followingCntr: user.followingCntr,
  //         followersCntr: user.followersCntr,
  //         postCntr: user.postCntr,
  //         reviewsCntr: user.reviewsCntr,
  //       }
  //     );

  //     return user;
  //   } catch (err) {
  //     console.error(`Error adding user: ${err}`);
  //     throw err;
  //   }
  // }
  public async AddUser(user: User): Promise<User> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        CREATE (user:User {
          username: $username,
          profilePic: $profilePic,
          email: $email,
          password: $password,
          Name: $name,
          birthDate: $birthDate,
          homeLocation: $homeLocation,
          sex: $sex,
          Bio: $bio,
          followingCntr: $followingCntr,
          followersCntr: $followersCntr,
          postCntr: $postCntr,
          reviewsCntr: $reviewsCntr
        })
        RETURN user
        `,
        {
          username: user.username,
          profilePic: user.profilePic,
          email: user.email,
          password: user.password, // Ensure this is the hashed password
          name: user.Name,
          birthDate: user.birthDate,
          homeLocation: user.homeLocation,
          sex: user.sex,
          bio: user.Bio,
          followingCntr: user.followingCntr,
          followersCntr: user.followersCntr,
          postCntr: user.postCntr,
          reviewsCntr: user.reviewsCntr,
        }
      );

      console.log(`User creation result: ${result}`);
      return user;
    } catch (err) {
      console.error(`Error adding user: ${err}`);
      throw err;
    }
  }
  public async FindUserByEmail(email: string): Promise<User | null> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User {email: $email})
        RETURN user
        `,
        { email }
      );

      const user = result.records[0]?.get('user').properties;
      if (user) {
        return {
          id: user.id,
          email: user.email,
          password: user.password,
          username: user.username,
          profilePic: user.profilePic,
          Name: user.Name,
          birthDate: user.birthDate,
          homeLocation: user.homeLocation,
          sex: user.sex,
          Bio: user.Bio,
          followingCntr: user.followingCntr,
          followersCntr: user.followersCntr,
          postCntr: user.postCntr,
          reviewsCntr: user.reviewsCntr
        };
      }

      return null;
    } catch (err) {
      console.error(`Error finding user by email: ${err}`);
      throw err;
    }
  }
  public async UpdateUser(username: string, updatedUser: User): Promise<User> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User {username: $username})
        SET user.profilePic = $profilePic,
            user.email = $email,
            user.Name = $name,
            user.Bio = $bio
        `,
        {
          username: username,
          profilePic: updatedUser.profilePic,
          email: updatedUser.email,
          name: updatedUser.Name,
          bio: updatedUser.Bio,
        }
      );
      return updatedUser;
    } catch (err) {
      console.error(`Error updating user: ${err}`);
      throw err;
    }
  }
  public async DeleteUser(username: string): Promise<void> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User {username: $username})
        DETACH DELETE user
        `,
        {
          username: username,
        }
      );
    } catch (err) {
      console.error(`Error deleting user: ${err}`);
      throw err;
    }
  }
  public async FetchUserProfile(username: string): Promise<User> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User {username: $username})
        RETURN user
        `,
        { username }
      );

      let userProfile: User = {} as User;

      result.records.forEach((record) => {
        const userData = record.get("user").properties;

        // Fetch user profile posts
        // const postNode = new PostNode();
        //const posts = await postNode.FetchUserProfilePosts(username);

        // Fetch user reviews
        //const reviewNode = new ReviewNode();
        //const reviews = await reviewNode.FetchUserReviews(username);

        userProfile = {
          username: userData.username,
          profilePic: userData.profilePic,
          Name: userData.Name,
          Bio: userData.Bio,
          followingCntr: parseFloat(userData.followingCntr),
          followersCntr: parseFloat(userData.followersCntr),
          //posts: posts,
          postCntr: parseFloat(userData.postCntr),
          // reviews: reviews,
          reviewsCntr: parseFloat(userData.reviewsCntr),
        };
      });
      return userProfile;
    } catch (err) {
      console.error(`Error fetching user profile: ${err}`);
      throw err;
    }
  }
  public async FollowUser(
    username: string,
    userToFollow: string
  ): Promise<void> {
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
  public async UnfollowUser(
    username: string,
    userToUnfollow: string
  ): Promise<void> {
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
  public async SearchUser(user: string): Promise<User[]> {
    try {
      const result = await dbDriver.executeQuery(
        `
            MATCH (user:User)
            WHERE toLower(user.username) STARTS WITH toLower($user)
            RETURN user
            `,
        { user: user }
      );
      return result.records.map(
        (record) => record.get("user").properties as User
      );
    } catch (err) {
      console.error(`Error searching for users: ${err}`);
      throw err;
    }
  }
}
