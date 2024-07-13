import { DbHelper } from "../../db/DbHelper.js";
import { User } from "../../entities/User.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;
export async function addUser(
  _: any,
  {
    username,
    profilePic,
    email,
    password,
    Name,
    birthDate,
    sex,
    Bio,
    followingCntr,
    followersCntr,
    postCntr,
    reviewsCntr,
    homeLocation,
  }: {
    username: string;
    profilePic: string;
    email: string;
    password: string;
    Name: string;
    birthDate: number;
    sex: string;
    Bio: string;
    followingCntr: number;
    followersCntr: number;
    postCntr: number;
    reviewsCntr: number;
    homeLocation: [number];
  }
): Promise<User[]> {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    console.log(`Plain password: ${password}`);
    console.log(`Hashed password: ${hashedPassword}`);

    const newUser: User = {
      username,
      profilePic,
      email,
      password: password,
      Name,
      birthDate,
      sex,
      Bio,
      followingCntr,
      followersCntr,
      postCntr,
      reviewsCntr,
      homeLocation,
    };

    const u = [await DbHelper.UserNode.AddUser(newUser)];
    console.log("User added:", newUser);
    return u;
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
}
export async function updateUser(
  _: any,
  { username, profilePic }: { username: string; profilePic: string }
) {
  try {
    await DbHelper.UserNode.UpdateUser(username, profilePic);
    console.log("User updated:", profilePic);
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user.");
  }
}
export async function deleteUser(
  _: any,
  { username }: { username: string }
): Promise<void> {
  try {
    await DbHelper.UserNode.DeleteUser(username);
    console.log("User deleted:", username);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}
export async function getUserProfileFun(
  _: any,
  { username, currentUsername }: { username: string; currentUsername: string }
) {
  try {
    // Fetch user posts using the database module function
    const Notifications = await DbHelper.UserNode.FetchUserProfile(
      username,
      currentUsername
    );
    const arr = [Notifications]; // return array is the error
    console.log(arr); // return array is the error
    return arr;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
export async function getUserNotifications(
  _: any,
  { username }: { username: string }
) {
  try {
    // Fetch user posts using the database module function
    const arr = await DbHelper.NotificationNode.getUserNotifications(username);
    return arr;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
export async function followUser(
  _: any,
  { username, userToFollow }: { username: string; userToFollow: string }
): Promise<void> {
  try {
    await DbHelper.UserNode.FollowUser(username, userToFollow);
    console.log("User followed:", userToFollow);
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
}
export async function GetFollowingList(
  _: any,
  { username }: { username: string }
) {
  try {
    const followedUsers = await DbHelper.UserNode.getFollowingList(username);
    console.log("Followed users:", followedUsers);
    return followedUsers;
  } catch (error) {
    console.error("Error fetching followed users:", error);
    throw error;
  }
}
export async function GetFollowersList(
  _: any,
  { username }: { username: string }
) {
  try {
    const followers = await DbHelper.UserNode.getFollowersList(username);
    console.log("Followers:", followers);
    return followers;
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw error;
  }
}
export async function GetUsersLikedPost(
  _: any,
  { postId }: { postId: string }
) {
  try {
    const users = await DbHelper.UserNode.getUsersLikedPost(postId);
    console.log("Users who liked post:", users);
    return users;
  } catch (error) {
    console.error("Error fetching users who liked post:", error);
    throw error;
  }
}
export async function unfollowUser(
  _: any,
  { username, userToUnfollow }: { username: string; userToUnfollow: string }
): Promise<void> {
  try {
    await DbHelper.UserNode.UnfollowUser(username, userToUnfollow);
    console.log("User unfollowed:", userToUnfollow);
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
}
export async function SearchUser(
  _: any,
  { user }: { user: string }
): Promise<User[]> {
  try {
    const users = await DbHelper.UserNode.SearchUser(user);
    console.log(`Users found with query '${user}':`, users);
    return users;
  } catch (error) {
    console.error(`Error searching for users: ${error}`);
    throw error;
  }
}
export async function leaderBoard(): Promise<User[]> {
  try {
    const users = await DbHelper.UserNode.leaderBoard();
    console.log(users);
    return users;
  } catch (error) {
    console.error(`Error searching for leaderboard: ${error}`);
    throw error;
  }
}
