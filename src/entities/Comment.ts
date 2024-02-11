import { User } from "./User.js";

export class Comment {
  id?: String;
  author?: User;
  text?: String;
  date?: number;
  likesCounter?: number;
  likedBy?: User[];
  repliesCntr?: number;
  replies?: Comment[];
}
