import { dbDriver } from "../dbConnection.js";


export class CommentNode {
    //Creations
    public create(comment: Comment): boolean {
        throw new Error("Method not implemented.");
    }

    public async AddComment(us: string, postId: string, commentId: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
            MATCH (user:User {username : $username}),
                  (post : Post{id:$id})
          
            CREATE (user)-[:ADD_COMMENT]->(comment:Comment {id: $commentId}),
                   (comment)-[:COMMENT_ON_POST]->(post)
            `
                , { username: us, id: postId, commentId: commentId }
            );
        } catch (err) {
            console.error(`Error adding comment: ${err}`);
            throw err;
        }
    }

    public async LikeComment(us: string, commentId: string): Promise<void> {
        try {
            const driver = dbDriver;
            const result = await driver.executeQuery(
                `
        MATCH (user:User {username : $username}),
              (comment:Comment {id:$id})
      
        CREATE (user)-[:LIKES_COMMENT]->(comment)
        `
                , { username: us, id: commentId }
            );
        } catch (err) {
            console.error(`Error liking comment: ${err}`);
            throw err;
        }
    }


}