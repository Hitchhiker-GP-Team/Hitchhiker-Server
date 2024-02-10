export interface IRating {

    totalRating :   fiveStarRating
    affordability : fiveStarRating
    priceRange :    PriceRange


}

export type fiveStarRating = 0 | 1 | 2 | 3 | 4 | 5 ;
export type PriceRange = { min: number; max: number; currency: string;};
