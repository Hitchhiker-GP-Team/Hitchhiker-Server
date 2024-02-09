import { User } from "./User";
import { usercard } from "./User";
import { Place, placePostAppearance } from "./Place";
import { Comment } from "./Comment";
import { Category } from "./Category";
import Journey from "./Journey";
import { Integer } from "neo4j-driver";



export interface basicPost{

  id: number;
  mediaURL:String[];
  author:usercard;
  caption: string;
  date : Date;
  hashtags : String[];
  tags : String[];
  place : placePostAppearance;
  keywords : String[];
  likesCntr : number;
  commentsCntr? : number;
  category? : String;


}


export class Post {

  //private static counter: number = 0;
  private id?: number;
  public mediaURL?:string[];
  private author?:usercard;
  private caption?: string;
  private date? : Date;
  private hashtags? : String[];
  private tags? : usercard[];
  private place?: Place;
  private keywords? : String[];
  private likesCntr? : number;
  private likedBy? : User[];
  private commentsCntr? : number;
  private comments? : Comment[];
  private category? : Category;
  private journey? : Journey

     
}
