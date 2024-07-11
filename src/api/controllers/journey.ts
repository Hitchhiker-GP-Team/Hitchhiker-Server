import { DbHelper } from "../../db/DbHelper";
import { Journey } from "../../entities/Journey";
import { Post } from "../../entities/Post";

export async function createJourney(
  _: any,
  {
    authorUsername,
    journeyId,
    title,
    date,
  }: { authorUsername: string; journeyId: string; title: string; date: number }
): Promise<Journey[]> {
  try {
    const journey: Journey = {
      id: journeyId,
      title,
      date,
    };

    const author = { username: authorUsername };
    journey.author = author;

    const j = [await DbHelper.JourneyNode.CreateJourney(journey)];
    console.log("Journey created:", journey);
    return j;
  } catch (error) {
    console.error("Error creating journey:", error);
    throw error;
  }
}
export async function getUserJourneys(
  _: any,
  { username }: { username: string }
) {
  try {
    // Fetch user journey using the database module function
    const userJournies = await DbHelper.JourneyNode.FetchUserJournies(username);
    console.log(userJournies);
    return userJournies;
  } catch (error) {
    console.error("Error fetching user journeys:", error);
    throw error;
  }
}
export async function fetchJourneyPosts(
  _: any,
  { username, journeyId }: { username: string; journeyId: string }
): Promise<Post[]> {
  try {
    const journeyPosts = await DbHelper.JourneyNode.FetchJourneyPosts(
      username,
      journeyId
    );
    console.log("Journey posts fetched:", journeyPosts);
    return journeyPosts;
  } catch (error) {
    console.error("Error fetching journey posts:", error);
    throw error;
  }
}
export async function addPostToJourney(
  _: any,
  { postId, journeyId }: { postId: string; journeyId: string }
): Promise<void> {
  try {
    await DbHelper.JourneyNode.AddPostToJourney(postId, journeyId);
    console.log("Post added to journey:", postId, journeyId);
  } catch (error) {
    console.error("Error adding post to journey:", error);
    throw error;
  }
}
export async function deleteJourney(
  _: any,
  { journeyId }: { journeyId: string }
): Promise<void> {
  try {
    await DbHelper.JourneyNode.DeleteJourney(journeyId);
    console.log("Journey deleted:", journeyId);
  } catch (error) {
    console.error("Error deleting journey:", error);
    throw error;
  }
}
export async function deletePostFromJourney(
  _: any,
  { journeyId, postId }: { journeyId: string; postId: string }
): Promise<void> {
  try {
    await DbHelper.JourneyNode.DeletePostFromJourney(journeyId, postId);
    console.log("Post deleted from journey:", postId, journeyId);
  } catch (error) {
    console.error("Error deleting post from journey:", error);
    throw error;
  }
}
