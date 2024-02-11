import { User } from "./User.js";

export class Comment {
  id?: string;
  author?: User;
  text?: string;
  date?: number;
  likesCounter?: number;
  likedBy?: User[];
  repliesCntr?: number;
  replies?: Comment[];
}
