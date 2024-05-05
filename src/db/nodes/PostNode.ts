import { dbDriver } from "../dbConnection.js";
import { Post } from "../../entities/Post.js";
import { User } from "../../entities/User.js";
import { Place } from "../../entities/Place.js";



export class PostNode  {

  // --------------------------------------------------------------------------------------
  // Fetches ------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------

  public async FetchUserProfilePosts(username: string): Promise<Post[]> {
    try {
        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (user:User {username: "kandeel00"})-[:ADD_POST]->(post:Post)
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)
            OPTIONAL MATCH (post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)
            RETURN post,
                   user.username AS username,
                   user.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            { username }
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tagged usernames
            //const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            //const placeProb = record.get("place").properties;

            // load Place
            // const place: Place = {
            //     name: placeProb.name,
            //     mapsId: placeProb.mapsId,
            //     id: placeProb.id
            // };

            // load User Card
            const author: User = {
                profilePic: record.get("profilePic"),
                username: record.get("username"),
            };

            // load Post object
            const currentPost: Post = {
                id: postProb.id,
                mediaURL: postProb.mediaUrls,
                author: author,
                caption: postProb.caption,
                date: parseFloat(postProb.postingDate), // test-driven
                hashtags: postProb.hashtags,
                //tags: taggedUsers,
                //place: place,
                keywords: postProb.keywords,
                likesCntr: parseFloat(postProb.likesCntr), // test-driven
                commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
                //category: record.get("categoryName"),
                liked: record.get("liked"),
                saved: record.get("saved"),
            };

            userPosts.push(currentPost);
        });

        return userPosts;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async FetchFollowingsPosts(username: string): Promise<Post[]> {
    try {
        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (user:User {username: $username})-[:FOLLOWS]->(following:User)-[:ADD_POST]->(post:Post)

            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)
            OPTIONAL MATCH (post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)

            RETURN post,
                   following.username AS username,
                   following.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            { username }
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tags usernames
            const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            const placeProb = record.get("place").properties;

            // load Place
            const place: Place = {
                name: placeProb.name,
                mapsId: placeProb.mapsId,
                id: placeProb.id
            };

            // load User Card
            const author: User = {
                profilePic: record.get("profilePic"),
                username: record.get("username"),
            };

            // load Post object
            const currentPost: Post = {
                id: postProb.id,
                mediaURL: postProb.mediaUrls,
                author: author,
                caption: postProb.caption,
                date: parseFloat(postProb.postingDate), // test-driven
                hashtags: postProb.hashtags,
                tags: taggedUsers,
                place: place,
                keywords: postProb.keywords,
                likesCntr: parseFloat(postProb.likesCntr), // test-driven
                commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
                category: record.get("categoryName"),
                liked: record.get("liked"),
                saved: record.get("saved"),
            };

            userPosts.push(currentPost);
        });

        return userPosts;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async FetchSavedPosts(username: string): Promise<Post[]> {
    try {
        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (user:User {username: $username})-[:SAVE_POST]->(post:Post)
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)
            RETURN post,
                   user.username AS username,
                   user.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                   true AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            { username }
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tags usernames
            const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            const placeProb = record.get("place").properties;

            // load Place
            const place: Place = {
                name: placeProb.name,
                mapsId: placeProb.mapsId,
                id: placeProb.id
            };

            // load User Card
            const author: User = {
                profilePic: record.get("profilePic"),
                username: record.get("username"),
            };

            // load Post object
            const currentPost: Post = {
                id: postProb.id,
                mediaURL: postProb.mediaUrls,
                author: author,
                caption: postProb.caption,
                date: parseFloat(postProb.postingDate), // test-driven
                hashtags: postProb.hashtags,
                tags: taggedUsers,
                place: place,
                keywords: postProb.keywords,
                likesCntr: parseFloat(postProb.likesCntr), // test-driven
                commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
                category: record.get("categoryName"),
                liked: record.get("liked"),
                saved: record.get("saved"),
            };

            userPosts.push(currentPost);
        });

        return userPosts;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async FetchLikedPosts(username: string): Promise<Post[]> {
    try {
        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (user:User {username: $username})-[:LIKES_POST]->(post:Post)
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category),
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)
            RETURN post,
                   user.username AS username,
                   user.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   true AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            { username }
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tags usernames
            const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            const placeProb = record.get("place").properties;

            // load Place
            const place: Place = {
                name: placeProb.name,
                mapsId: placeProb.mapsId,
                id: placeProb.id
            };

            // load User Card
            const author: User = {
                profilePic: record.get("profilePic"),
                username: record.get("username"),
            };

            // load Post object
            const currentPost: Post = {
                id: postProb.id,
                mediaURL: postProb.mediaUrls,
                author: author,
                caption: postProb.caption,
                date: parseFloat(postProb.postingDate), // test-driven
                hashtags: postProb.hashtags,
                tags: taggedUsers,
                place: place,
                keywords: postProb.keywords,
                likesCntr: parseFloat(postProb.likesCntr), // test-driven
                commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
                category: record.get("categoryName"),
                liked: record.get("liked"),
                saved: record.get("saved"),
            };

            userPosts.push(currentPost);
        });

        return userPosts;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async FetchPlacePosts(username: string ,placeId : string): Promise<Post[]> {
    try {


        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (author:User)-[:ADD_POST]->(post:Post)-[:HAPPEND_AT]->(place:Place {id : $placeId})
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (user:User{username:$username})
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)
            RETURN post,
                   author.username AS authorUsername,
                   author.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            {placeId,username}
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tags usernames
            const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            const placeProb = record.get("place").properties;

            // load Place
            const place: Place = {
                name: placeProb.name,
                mapsId: placeProb.mapsId,
                id : placeProb.id
            };

            // load User Card
            const author: User = {
                profilePic: record.get("profilePic"),
                username: record.get("authorUsername"),
            };

            // load Post object
            const currentPost: Post = {
                id: postProb.id,
                mediaURL: postProb.mediaUrls,
                author: author,
                caption: postProb.caption,
                date: parseFloat(postProb.postingDate), // test-driven
                hashtags: postProb.hashtags,
                tags: taggedUsers,
                place: place,
                keywords: postProb.keywords,
                likesCntr: parseFloat(postProb.likesCntr), // test-driven
                commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
                category: record.get("categoryName"),
                liked: record.get("liked"),
                saved: record.get("saved")
            };

            userPosts.push(currentPost);
        });

        return userPosts;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async FetchCategoryPosts(username : string ,category : string): Promise<Post[]> {
    try {


        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (author:User)-[:ADD_POST]->(post:Post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category{name:$category})

            OPTIONAL MATCH (user:User{username:$username})
            OPTIONAL MATCH (user)-[like:LIKES_POST]->(post)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)

            RETURN post,
                   author.username AS username,
                   author.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   CASE WHEN like IS NOT NULL THEN true ELSE false END AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            {username ,category}
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tags usernames
            const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            const placeProb = record.get("place").properties;

            // load Place
            const place: Place = {
                name: placeProb.name,
                mapsId: placeProb.mapsId,
                id : placeProb.id
            };

            // load User Card
            const author: User = {
                profilePic: record.get("profilePic"),
                username: record.get("username"),
            };

            // load Post object
            const currentPost: Post = {
                id: postProb.id,
                mediaURL: postProb.mediaUrls,
                author: author,
                caption: postProb.caption,
                date: parseFloat(postProb.postingDate), // test-driven
                hashtags: postProb.hashtags,
                tags: taggedUsers,
                place: place,
                keywords: postProb.keywords,
                likesCntr: parseFloat(postProb.likesCntr), // test-driven
                commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
                category: record.get("categoryName"),
                liked: record.get("liked"),
                saved: record.get("saved")
            };

            userPosts.push(currentPost);
        });

        return userPosts;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async FetchArchivedPosts(username: string): Promise<Post[]> {
    try {
        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (user:User {username: $username})-[:ARCHIVE_POST]->(post:Post)
            OPTIONAL MATCH (user)-[save:SAVE_POST]->(post)
            OPTIONAL MATCH (post)-[:POST_BELONGS_TO_CATEGORY]->(category:Category)
            OPTIONAL MATCH (post)-[:HAPPEND_AT]->(place:Place)
            OPTIONAL MATCH (post)-[:TAG]->(tagged:User)
            RETURN post,
                   user.username AS username,
                   user.profilePic AS profilePic,
                   category.name AS categoryName,
                   place,
                   true AS liked,
                   CASE WHEN save IS NOT NULL THEN true ELSE false END AS saved,
                   COLLECT(tagged.username) as tags
            ORDER BY post.postingDate DESC
            SKIP 0
            LIMIT 50
            `,
            { username }
        );

        // a list to hold all posts retrieved from the database
        const userPosts: Post[] = [];

        result.records.forEach((record) => {
            // load the list with tags usernames
            const taggedUsers = record.get("tags");

            const postProb = record.get("post").properties;
            const placeProb = record.get("place").properties;

            // load Place
            const place: Place = {
                name: placeProb.name,
                mapsId: placeProb.mapsId,
                id: placeProb.id
            };

            // load User Card
            const author: User = {
                profilePic: record.get("profilePic"),
                username: record.get("username"),
            };

            // load Post object
            const currentPost: Post = {
                id: postProb.id,
                mediaURL: postProb.mediaUrls,
                author: author,
                caption: postProb.caption,
                date: parseFloat(postProb.postingDate), // test-driven
                hashtags: postProb.hashtags,
                tags: taggedUsers,
                place: place,
                keywords: postProb.keywords,
                likesCntr: parseFloat(postProb.likesCntr), // test-driven
                commentsCntr: parseFloat(postProb.commentsCntr), // test-driven
                category: record.get("categoryName"),
                liked: record.get("liked"),
                saved: record.get("saved"),
            };

            userPosts.push(currentPost);
        });

        return userPosts;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }


  // --------------------------------------------------------------------------------------
  // Creations ----------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------

  public async CreatePost(post : Post): Promise<Post> {
    try {

        const d = Math.floor(Number(post.date))

        const driver = dbDriver;
        const result = await driver.executeQuery(
            `
            MATCH (author:User {username: $username}),
                  (place:Place {id: $placeId}),
                  (category:Category {name: $CategoryName})

            CREATE (post:Post {
                id: $postId,
                caption: $caption,
                postingDate: $postingDate,
                likesCntr: $likesCntr,
                mediaUrls: $mediaUrls,
                hashtags: $hashtags,
                commentsCntr: $commentsCntr
            })<-[:ADD_POST]-(author),  
                  (post)-[:HAPPEND_AT]->(place),
                  (post)-[:POST_BELONGS_TO_CATEGORY]->(category)

            

            WITH  author ,post, $predictions AS predictedCategories
            UNWIND predictedCategories AS prediction
            MERGE (category:Category {name: prediction.class})
            MERGE (post)-[rel:POST_BELONGS_TO_CATEGORY]->(category)
            SET rel.confidence = prediction.perc
            SET author.postCntr = author.postCntr + 1

            
            

            RETURN post
            `
            ,
            {
              //user
              username    :post.author?.username, 
              //post
              postId      :post.id,
              caption     :post.caption,
              postingDate :post.date,
              likesCntr   :post.likesCntr,
              mediaUrls   :post.mediaURL,
              hashtags    :post.hashtags,
              commentsCntr:post.commentsCntr,
              tags         :post.tags,
              //place
              placeId     :post.place?.id,
              //category
              CategoryName:post.category?.name,
              predictions:post.keywords
            }
        );

        

        return post;
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async LikePost(us :string , postId: string) : Promise<void>
  {

    try{

    const driver =dbDriver
    const result = await driver.executeQuery(
        `
        MATCH (user:User {username : $username}),(post : Post{id:$id})
        CREATE (user)-[:LIKES_POST]->(post)
        SET post.likesCntr = post.likesCntr + 1
        `    
        ,{username : us , id : postId}
    )
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async SavePost(us :string , postId: string) : Promise<void>
  {

    try{

    const driver =dbDriver
    const result = await driver.executeQuery(
        `
        MATCH (user:User {username : $username}),
            (post : Post{id:$id})
    
        CREATE (user)-[:SAVE_POST]->(post)
        `    
        ,{username : us , id : postId}
    )
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async ArchivePost(us :string , postId: string) : Promise<void>
  {

    try{

    const driver =dbDriver
    const result = await driver.executeQuery(
        `
        MATCH (u:User{username:$username})-[r:ADD_POST]->(p:Post{id:$id})
        DELETE r
        CREATE (u)-[:ARCHIVE_POST]->(p)
        `    
        ,{username : us , id : postId}
    )
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }


  // --------------------------------------------------------------------------------------
  // Updates ------------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------
  
  public async UnLikePost(us :string , postId: string) : Promise<void>
  {

    try{

    const driver =dbDriver
    const result = await driver.executeQuery(
        `
        MATCH (user:User {username : $username})-[like:LIKES_POST]->(post : Post{id:$id})
        DELETE like 
        SET post.likesCntr = post.likesCntr -1 
        `    
        ,{username : us , id : postId}
    )
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async UnSavePost(us :string , postId: string) : Promise<void>
  {

    try{

    const driver =dbDriver
    const result = await driver.executeQuery(
        `
        MATCH (user:User {username : $username})-[save:SAVE_POST]->(post : Post{id:$id})
        DELETE save 
        `    
        ,{username : us , id : postId}
    )
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async UnArchivePost(us :string , postId: string) : Promise<void>
  {

    try{

    const driver =dbDriver
    const result = await driver.executeQuery(
        `
        MATCH (u:User{username:$username})-[r:ARCHIVE_POST]->(p:Post{id:$id})
        DELETE r
        CREATE (u)-[:ADD_POST]->(p)
        `    
        ,{username : us , id : postId}
    )
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }


  // --------------------------------------------------------------------------------------
  // Deletions ----------------------------------------------------------------------------
  // --------------------------------------------------------------------------------------

  public async DeletePost(postId: string ) : Promise<void>
  {

    try{

    const driver =dbDriver
    const result = await driver.executeQuery(
        `
        MATCH (post:Post{id:$id})<-[:ADD_POST]-(user:User)
        SET user.postCntr = user.postCntr -1
        DETACH DELETE post
        `    
        ,{ id : postId}
    )
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async DeleteALLPosts(username:string) : Promise<void>
  {

    try{

    const driver =dbDriver
    const result = await driver.executeQuery(
        `
        MATCH (user:User{username:$username})-[:ADD_POST]->(post:Post)
        SET user.postCntr = 0
        DETACH DELETE post
        `    
        ,{ username : username}
    )
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

  public async DeleteAllArchivedPosts(username:string) : Promise<void>
  {

    try{

    const driver =dbDriver
    const result = await driver.executeQuery(
        `
        MATCH (user:User{username:$username})-[:ARCHIVE_POST]->(post:Post)
        DETACH DELETE post
        `    
        ,{ username : username}
    )
    } catch (err) {
        console.error(`Error fetching user posts: ${err}`);
        throw err;
    }
  }

}




