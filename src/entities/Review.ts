import { Integer } from "neo4j-driver";
import { Place } from "./Place.js";
import { IRating } from "./Rating/IRating.js";
import { User } from "./User.js";

export class Review {
  id?: string;
  author?: User;
  place?: Place;
  text?: string;
  rating?: IRating;
  date?: number;
  likesCntr?: number;
  dislikesCntr?: number;
}
