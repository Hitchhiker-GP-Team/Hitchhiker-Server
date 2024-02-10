import { User } from "./User.js"

export class Comment {

  commentID?  : String
  author? : User 
  text? : String
  date? : Date
  likesCounter? : number
  likedBy? : User[]
  repliesCntr? : number
  replies? : Comment[]

}
