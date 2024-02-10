import { IRating, fiveStarRating, PriceRange } from "./IRating";


export class HotelsRating implements IRating {

    affordability!:  fiveStarRating;
    priceRange!:     PriceRange;
    totalRating!:    fiveStarRating
    //----------------------------------
    Comfort!:        fiveStarRating
    hygiene!:         fiveStarRating
    roomService!:    fiveStarRating
    aquaServices!:   fiveStarRating
    DinningQuality!: fiveStarRating   
    
}
