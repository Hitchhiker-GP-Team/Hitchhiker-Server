import { Integer } from "neo4j-driver";
import { Place } from "./Place.js";
import { IRating } from "./Rating/IRating.js";
import { User } from "./User.js";

export class Review {
  id?: number;
  author?: User;
  place?: Place;
  text?: string;
  rating?: number;
  date?: number;
  likesCntr?: number;
  dislikesCntr?: number;
}
