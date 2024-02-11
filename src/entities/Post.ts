import { User } from "./User.js";
import { Place } from "./Place.js";
import { Comment } from "./Comment.js";
import { Category } from "./Category.js";
import { Journey } from "./Journey.js";

export class Post {
  id?: string;
  mediaURL?: string[];
  author?: User;
  caption?: string;
  date?: number;
  hashtags?: string[];
  tags?: User[];
  place?: Place;
  keywords?: string[];
  likesCntr?: number;
  likedBy?: User[];
  commentsCntr?: number;
  comments?: Comment[];
  category?: Category;
  journey?: Journey;
}
