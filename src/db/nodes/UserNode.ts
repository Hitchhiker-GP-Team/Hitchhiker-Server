import { dbDriver } from "../dbConnection.js";
import { User, titles } from "../../entities/User.js";
// import { PostNode } from "./PostNode.js";
// import { ReviewNode } from "./ReviewNode.js";

export class UserNode {
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
          followingCntr: 0,
          followersCntr: 0,
          postCntr: 0,
          reviewsCntr: 0,
          score: 0,
          totalUpvotes: 0,
          totalDownvotes: 0
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
  public async FindUserByUsername(username: string): Promise<User | null> {
    try {
      const driver = dbDriver;
      const result = await driver.executeQuery(
        `
        MATCH (user:User {username: $username})
        RETURN user
        `,
        { username }
      );


      console.log(result.records.length)

      if( result.records.length > 0 ){
      const user = result.records[0]?.get('user').properties;
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
        OPTIONAL MATCH (user)-[exp:HAS_EXPERIENCE_AT]->(category:Category)
        RETURN user, collect({title: category.name, score: exp.score}) AS ranks

        `,
        { username }
      );

      let userProfile: User = {} as User;

      result.records.forEach((record) => {
        const userData = record.get("user").properties;
        userProfile = {
          username: userData.username,
          profilePic: userData.profilePic,
          Name: userData.Name,
          Bio: userData.Bio,
          followingCntr: parseFloat(userData.followingCntr),
          followersCntr: parseFloat(userData.followersCntr),
          postCntr: parseFloat(userData.postCntr),
          reviewsCntr: parseFloat(userData.reviewsCntr),
          score: parseFloat(userData.score),
          titles: this.processScores(record.get("ranks"),parseFloat(userData.score)),
          totalUpvotes: parseFloat(userData.totalUpvotes),
          totalDownvotes: parseFloat(userData.totalDownvotes),
        };
      });
      return userProfile;
    } catch (err) {
      console.error(`Error fetching user profile: ${err}`);
      throw err;
    }
  }
  public modifyTitle(category: string, score:number): string {
    if(score > 0 && score < 100)
      return category + " Beginner "  
    else if(score >= 100 && score < 200)
      return category + " Lover";
    else if(score >= 200 && score < 300)
      return category + " Enthusiast";
    else if(score >= 300 && score < 400)
      return category + " Critic"
    else if(score == 0)
      return category + " Newbie"
    else
      return category + " Hater";

  }
  
  public processScores(scores: any[],score:number): titles[] {
    let ranks: titles[] = [];
    ranks.push({title: "Over all", score: score});
    if(scores[0].title)
    {
      scores = scores.map(score => ({
        title: this.modifyTitle(score.title, score.score),
        score: parseFloat(score.score),
      }));
      ranks.push(...scores);
    }
    return ranks;
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
        SET follower.followingCntr = follower.followingCntr + 1
        SET following.followersCntr = following.followersCntr +1 
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
      SET follower.followingCntr = follower.followingCntr - 1
      SET following.followersCntr = following.followersCntr - 1 
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
            WHERE toLower(user.username) CONTAINS toLower($user)
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
