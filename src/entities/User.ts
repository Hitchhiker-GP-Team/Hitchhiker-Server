import { Integer } from "neo4j-driver";
import { Coordinates } from "./Place.js";
import { Post } from "./Post.js";
import { Review } from "./Review.js";

export class User {
  username?: string;
  profilePic?: string;
  email?: string;
  password?: string;
  Name?: string;
  birthDate?: Number;
  homeLocation?: [Number];
  sex?:string;
  titles?: titles;
  Bio?: string;
  followingCntr?: Number;
  followings?: User[];
  followersCntr?: Number;
  followers?: User[];
  posts?: Post[];
  postCntr?: Number;
  reviews?: Review[];
  reviewsCntr?: Number;
}
interface titles {
  [key: string]: number;
}

export type sex = "m" | "f";

/*
let titles:titles = {};
titles['hello'] = 123;
*/
