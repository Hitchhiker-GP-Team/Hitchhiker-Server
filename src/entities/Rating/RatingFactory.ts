import { HotelsRating } from "./HotelsRating";
import { IRating } from "./IRating";
import { ResturantRating } from "./ResturantRating";

export class RatingFactory {

        static getRating(ratingType:String): IRating {
        
        if(ratingType === "resturantsRating")
        {
            return new ResturantRating();
        }
        else if(ratingType==="hotelsRating")
        {
            return new HotelsRating();
        }
        else
        {
            throw new Error("unknow rating type : " + ratingType)
        }

    }

}
