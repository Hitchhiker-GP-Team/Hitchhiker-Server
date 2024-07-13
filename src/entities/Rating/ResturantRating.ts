import { IRating } from "./IRating.js";

export class ResturantRating implements IRating {
  affordability!: number;
  overAll!: number;
  atmosphere!: number;
  accesability!: number;
  priceMin!: number;
  priceMax!: number;
  //----------------------------------
  foodQuality!: number;
  valueForPrice!: number;
  hygiene!: number;
  menuVariety!: number;
  consistency!: number;
}
