import { DbHelper } from "../../db/DbHelper";
import { User } from "../../entities/User";

export async function addUser(_: any, { username, profilePic, email, password, Name, birthDate, sex, Bio, followingCntr, followersCntr, postCntr, reviewsCntr ,homeLocation }: { username: string; profilePic: string; email: string; password: string; Name: string; birthDate: number;sex: string; Bio: string; followingCntr: number; followersCntr: number; postCntr: number; reviewsCntr: number;homeLocation:[number] }): Promise<User[]> {
    try {
      const newUser: User = {
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
        homeLocation
      };
  
      
      const u =[await DbHelper.UserNode.AddUser(newUser)];
      console.log("User added:", newUser);
      return u
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }
  export async function updateUser(_: any, { username, profilePic, email, password, Name, Bio }: { username: string; profilePic: string; email: string; password: string; Name: string; Bio: string; }): Promise<User[]>{
    try {
      const updatedUser: User = {
        username: username,
        profilePic: profilePic,
        email: email,
        password: password, 
        Name: Name,
        Bio: Bio
      };
  
      const up = [await DbHelper.UserNode.UpdateUser(username, updatedUser)];
      console.log("User updated:", updatedUser);
      return up;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user.");
    }
  }
  
  export async function deleteUser(_: any, { username }: { username: string }): Promise<void> {
    try {
      await DbHelper.UserNode.DeleteUser(username);
      console.log("User deleted:", username);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
  export async function getUserProfileFun(_: any, { username }: { username: string }) {
    try {
      // Fetch user posts using the database module function
      const userInfo = await DbHelper.UserNode.FetchUserProfile(username);
      const arr = [userInfo]; // return array is the error
      console.log(arr); // return array is the error
      return arr;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }
  export async function followUser(_: any, { username, userToFollow }: { username: string; userToFollow: string }): Promise<void> {
    try {
      await DbHelper.UserNode.FollowUser(username, userToFollow);
      console.log("User followed:", userToFollow);
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  }
  export async function unfollowUser(_: any, { username, userToUnfollow }: { username: string; userToUnfollow: string }): Promise<void> {
    try {
      await DbHelper.UserNode.UnfollowUser(username, userToUnfollow);
      console.log("User unfollowed:", userToUnfollow);
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw error;
    }
  }