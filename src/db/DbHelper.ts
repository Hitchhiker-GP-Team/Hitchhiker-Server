import neo4j, { Record } from 'neo4j-driver';
import { Post, basicPost } from '../entities/Post.js';
import { User, usercard } from "../entities/User.js";
import { Category } from '../entities/Category.js';
import { Place, placePostAppearance } from '../entities/Place.js';


// a function to retrieve all posts a specific user posted (Profile Posts)
export async function fetchUserPosts(username: string): Promise<basicPost[]> {
  const URI = 'neo4j://localhost';
  const USER = 'neo4j';
  const PASSWORD = '12345678';
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const session = driver.session();
    
    const result = await session.run(
      `
      MATCH (u:User {username: $username})-[:ADD_POST]->(p:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category), (p)-[:HAPPEND_AT]->(place:Place),(p)-[:TAG]->(tagged:User)
      RETURN p, u.username AS username, u.profilePic AS profilePic, category.name AS categoryName, place , tagged , COLLECT(tagged.username) as taggedUsers

      `,
      { username }
    );

    console.log("postProb")
      //a list to hold all posts retrieved from database
      const userPosts : basicPost[] =[];
      
      
    
      result.records.forEach(record => {

      //a list to hold all tagged users  
      const tagged : String[] =[];

      // load the list with taggedUsers username's
      const taggedUsers = record.get('taggedUsers');
      taggedUsers.forEach((taggedUser:String)=> {
          tagged.push(taggedUser);
      });
  
    
        
      const postProb = record.get('p').properties
      const placeProb = record.get('place').properties

      //load placePostAppearance object
      const place : placePostAppearance = {name:placeProb.name,mapsid:placeProb.mapsId}

      //load usercard object
      const Postauthor : usercard = { profilePic: record.get('profilePic'), username: record.get('username') }
  
      //load basicPost object
      const currentPost : basicPost = {
        
        id: postProb.id,
        mediaURL:postProb.mediaUrls,
        author: Postauthor,
        caption: postProb.caption,
        date : postProb.postingDate.low, //test-driven
        hashtags : postProb.hashtags,
        tags : tagged,
        place : place,
        keywords : postProb.keywords,
        likesCntr : postProb.likesCntr.low,//test-driven
        commentsCntr : postProb.commentsCntr.low,//test-driven
        category : record.get('categoryName')

      }

      
      
      userPosts.push(currentPost);
                     
    });

    await session.close();
    return userPosts;
  } catch (err) {
    console.error(`Error fetching user posts: ${err}`);
    throw err;
  } finally {
    if (driver) {
      await driver.close();
      console.log('Connection closed');
    }
  }
}




