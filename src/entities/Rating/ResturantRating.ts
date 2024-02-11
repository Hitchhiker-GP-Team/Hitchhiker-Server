import { IRating, PriceRange, fiveStarRating } from "./IRating.js";

export class ResturantRating implements IRating {
  totalRating!: fiveStarRating;
  affordability!: fiveStarRating;
  priceRange!: PriceRange;
  //----------------------------------
  foodQuality!: fiveStarRating;
  valueForPrice!: fiveStarRating;
  hygiene!: fiveStarRating;
  atmosphere!: fiveStarRating;
  menuVariety!: fiveStarRating;
  consistency!: fiveStarRating;
}
