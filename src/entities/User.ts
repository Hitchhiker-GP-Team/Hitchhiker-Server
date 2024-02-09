import { Post, Review } from "./";

export interface usercard{
  username: string;
  profilePic: String;
}


export class User {
  private static counter?: number = 0;
  public username?: string;
  public profilePic?: string;
  private email?: string;
  private password?: string;
  private Name?: string;
  private birthDate?: string; //date;
  private homeLocation?: coordinates;
  private sex?: sex;
  private titles?: titles;
  private Bio?: string;
  private followingCntr?: number;
  private followings?: User[];
  private followersCntr?: number;
  private followers?: User[];
  private posts?: Post[];
  private postCntr?: number;
  private reviews?: Review[];
  private reviewsCntr?: number;

  /*
  loadUserCard() {
    const UserCard: User = DbHelper.User.fetchUserCard;
    this.id = UserCard.id;
    this.profilePic = UserCard.profilePic;
    this.username = UserCard.username;
  }
  */
  loadAuthorCard(username: string, profilePic: string) {
    this.username = username;
    this.profilePic = profilePic;
  }
  


}

interface titles {
  [key: string]: number;
}
type coordinates = {
  latitude: number;
  longitude: number;
};

type sex = "m" | "f";

/*
let titles:titles = {};
titles['hello'] = 123;
*/






