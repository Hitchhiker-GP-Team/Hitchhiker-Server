import { DbHelper } from "../../db/DbHelper";
import { Place } from "../../entities/Place";

export async function addPlace(_: any, { id, name, mapsId, type, description }: { id: string; name: string; mapsId: string; type: string; description: string; }): Promise<Place[]> {
    try {
      const newPlace: Place = {
        id,
        name,
        mapsId,
        type,
        description
      };
  
      const p = [await DbHelper.PlaceNode.AddPlace(newPlace)];
      console.log("Place added:", newPlace);
      return p;
    } catch (error) {
      console.error("Error adding place:", error);
      throw error;
    }
  }
  
  export async function updatePlace(_: any, { placeId, name, mapsId, type, description }: { placeId: string; name?: string; mapsId?: string; type?: string; description?: string; }): Promise<Place[]>{
    try {
      const updatedPlace: Place = {
        id: placeId,
        name,
        mapsId,
        type,
        description
      };
  
      const p = [await DbHelper.PlaceNode.EditPlace(placeId, updatedPlace)];
      console.log("Place updated:", updatedPlace);
      return p;
    } catch (error) {
      console.error("Error updating place:", error);
      throw new Error("Failed to update place.");
    }
  }
  
  
  export async function deletePlace(_: any, { placeId }: { placeId: string }): Promise<void> {
    try {
      await DbHelper.PlaceNode.DeletePlace(placeId);
      console.log(`Place deleted: ${placeId}`);
    } catch (error) {
      console.error(`Error deleting place: ${error}`);
      throw error;
    }
  }
  export async function addPostToPlace(_: any, { postId, placeId }: { postId: string; placeId: string }): Promise<void> {
    try {
      await DbHelper.PlaceNode.AddPostToPlace(postId, placeId);
      console.log(`Post ${postId} added to place ${placeId}`);
    } catch (error) {
      console.error(`Error adding post to place: ${error}`);
      throw error;
    }
  }
  export async function addPlaceToCategory(_: any, { placeId, categoryName }: { placeId: string; categoryName: string }): Promise<void> {
    try {
      await DbHelper.PlaceNode.AddPlaceToCategory(placeId, categoryName);
      console.log(`Place ${placeId} added to category ${categoryName}`);
    } catch (error) {
      console.error(`Error adding place to category: ${error}`);
      throw error;
    }
  }
  export async function addReviewToPlace(_: any, { reviewId, placeId }: { reviewId: string; placeId: string }): Promise<void> {
    try {
      await DbHelper.PlaceNode.AddReviewToPlace(reviewId, placeId);
      console.log(`Review ${reviewId} added to place ${placeId}`);
    } catch (error) {
      console.error(`Error adding review to place: ${error}`);
      throw error;
    }
  }
  export async function addRatingToPlace(_: any, { ratingId, placeId }: { ratingId: string; placeId: string }): Promise<void> {
    try {
      await DbHelper.PlaceNode.AddRatingToPlace(ratingId, placeId);
      console.log(`Rating ${ratingId} added to place ${placeId}`);
    } catch (error) {
      console.error(`Error adding rating to place: ${error}`);
      throw error;
    }
  }
  export async function addUserVisitedPlace(_: any, { username, placeId }: { username: string; placeId: string }): Promise<void> {
    try {
      await DbHelper.PlaceNode.AddUserVisitedPlace(username, placeId);
      console.log(`User ${username} visited place ${placeId}`);
    } catch (error) {
      console.error(`Error adding user visited place: ${error}`);
      throw error;
    }
  }