import { Coordinates } from "./Place.js";
import { Post } from "./Post.js";
import { Review } from "./Review.js";

export class User {
  username?: string;
  profilePic?: string;
  email?: string;
  password?: string;
  Name?: string;
  birthDate?: number;
  homeLocation?: Coordinates;
  sex?:sex;
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

type sex = "m" | "f";

/*
let titles:titles = {};
titles['hello'] = 123;
*/
