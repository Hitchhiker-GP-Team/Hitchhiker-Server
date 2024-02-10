import { Post } from "./Post.js";
import { Review } from "./Review.js";

export class User {
  username?: string;
  profilePic?: string;
  email?: string;
  password?: string;
  Name?: string;
  birthDate?: string; //date;
  homeLocation?: coordinates;
  sex?: sex;
  titles?: titles;
  Bio?: string;
  followingCntr?: number;
  followings?: User[];
  followersCntr?: number;
  followers?: User[];
  posts?: Post[];
  postCntr?: number;
  reviews?: Review[];
  reviewsCntr?: number;
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
