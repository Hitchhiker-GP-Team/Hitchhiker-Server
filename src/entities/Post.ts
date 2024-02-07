import { User } from "./User";

export class Post {

  //private static counter: number = 0;
  private id?: number;
  private mediaURL?:string;
  private author?:User;
  private caption?: string;

  constructor(id:number ,mediaURL:string , caption:string ,author:User){
    this.id = id;
    this.mediaURL=mediaURL;
    this.caption=caption;
    this.author=author;
  }
    




}
