import { IRating } from "./IRating";

export class HotelsRating implements IRating {
  affordability!: number;
  overAll!: number;
  accesability!: number;
  priceMin!: number;
  priceMax!: number;
  atmosphere!: number;
  //----------------------------------
  Comfort!: number;
  hygiene!: number;
  roomService!: number;
  aquaServices!: number;
  DinningQuality!: number;
}
