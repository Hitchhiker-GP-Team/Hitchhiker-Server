import { Post } from "./Post.js";
import { IRating } from "./Rating/IRating.js";
import { Review } from "./Review.js";

export class Place {
  id?: string;
  mapsId?: string;
  name?: string;
  type?: string;
  location?: Coordinates;
  ratings?: IRating;
  description?: string;
  reviewsCntr?: number;
  reviews?: Review[];
  posts?: Post[];
}
export type Coordinates = {
  latitude: number;
  longitude: number;
};
