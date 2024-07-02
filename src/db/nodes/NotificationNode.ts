import { Notification } from "../../entities/Notification.js";
import { dbDriver } from "../dbConnection.js";

export class NotificationNode {

    // general method to update any notification
    public async UpdateNoti(noti:Notification):Promise<Notification>
    {
        const driver = dbDriver;
        
        //if notification already exists , add initiator to initiators list , change date and change counter
        const update = await driver.executeQuery( 
            `
            MATCH (notification:Notification {id: $notificationId}),
                  (notification)<-[:HAVE_NOTIFICATION]-(receiver)
            SET notification.initiators = CASE 
                WHEN size(notification.initiators) = 1 
                    THEN [$newUsername, notification.initiators[0]]
                ELSE 
                    [$newUsername, notification.initiators[0]]
                END,
                notification.date = $date, 
                notification.counter = notification.counter + 1 
            RETURN notification.initiators AS initiators , notification.counter as Cntr, receiver.username as receiverUsername, notification.authorName as authorUsername

            `
        ,
        {
            notificationId : noti.id ,
            newUsername : noti.initiator,
            date : Math.floor(Number(noti.date))
        });

    
        //update initiators and return the updated notification
        noti.author = update.records[0].get("authorUsername")
        noti.initiatorsList = update.records[0].get("initiators")
        noti.initiatorsCntr = update.records[0].get("Cntr")
        noti.receiver = update.records[0].get("receiverUsername")
        return noti; 
    }


    //-------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------
    
    
    public async likePostNotification(noti : Notification): Promise<Notification> {
        
        try{

            const d = Math.floor(Number(noti.date))
            const driver = dbDriver;

            //check node existence
            const condition = await driver.executeQuery(
                `
                MATCH (noti:Notification)-[l:LIKE_POST_NOTI]-> (post:Post{id: $referenceId})
                return l , noti.initiatorsCntr as Cntr , noti.id as id
                `
                ,
                { 
                 referenceId : noti.referenceId,     
                }
            );

            
            const notiExists = condition.records.length > 0
            console.log(notiExists)
            

            if(notiExists){
                
                //keep the id constnat
                noti.id = condition.records[0].get('id')
                //update the notification
                return this.UpdateNoti(noti);            

            } else {

                //if doesnt exist , create one
                const result = await driver.executeQuery(
                `
                MATCH (receiver:User)-[:ADD_POST]-> (post:Post{id: $referenceId}),
                      (initiator:User {username: $initiator})
                CREATE (notification:Notification {id: $id, body: $body, referenceType:$referenceType, initiators: [$initiator], counter:1.0 ,date: $date, author : receiver.username})
                CREATE (notification)<-[:HAVE_NOTIFICATION]-(receiver)
                CREATE (notification)-[:LIKE_POST_NOTI]->(post)
                Return receiver.username as receiverUsername , notification.counter as Cntr , notification.initiators as initiators
                `
                ,
                {
                    id            : noti.id,
                    initiator     : noti.initiator, 
                    referenceId   : noti.referenceId,
                    body          : noti.body,
                    date          : Math.floor(Number(noti.date)),
                    referenceType : noti.referenceType
                });

                console.log("in creation")
                console.log(noti.referenceId)

                console.log("record length is :" + result.records.length)

                //update initiators and return the updated notification
                noti.initiatorsList = result.records[0].get("initiators")
                noti.initiatorsCntr = result.records[0].get("Cntr")
                noti.receiver = result.records[0].get("receiverUsername")
                return noti; 
            }   
           

        } catch (err) {
         console.error(`Error creating notification: ${err}`);
         throw err;
        }

    }
 
    
    //-------------------------------------------------------------------------------------
    //-------------------------------------------------------------------------------------


    public async likeCommentNotification(noti : Notification): Promise<Notification> {
        
        try{

            const d = Math.floor(Number(noti.date))
            const driver = dbDriver;

            //check node existence
            const condition = await driver.executeQuery(
                `
                MATCH (noti:Notification)-[l:LIKE_COMMENT_NOTI]-> (comment:Comment{id: $referenceId})
                return l , noti.initiatorsCntr as Cntr , noti.id as id
                `
                ,
                { 
                 referenceId : noti.referenceId,     
                }
            );

            
            const notiExists = condition.records.length > 0
            console.log(notiExists)
            

            if(notiExists){
                
                //keep the id constnat
                noti.id = condition.records[0].get('id')
                //update the notification
                return this.UpdateNoti(noti);            

            } else {

                //if doesnt exist , create one
                const result = await driver.executeQuery(
                `
                MATCH (receiver:User)-[:ADD_COMMENT]-> (comment:Comment{id: $referenceId})-[:COMMENT_ON_POST]->(p:Post)<-[:ADD_POST]-(author:User)
                OPTIONAL MATCH (initiator:User {username: $initiator})
                CREATE (notification:Notification {id: $id, body: $body, referenceType:$referenceType, initiators: [$initiator], counter:1.0 ,date: $date, authorName : author.username})
                CREATE (notification)<-[:HAVE_NOTIFICATION]-(receiver)
                CREATE (notification)-[:LIKE_COMMENT_NOTI]->(comment)
                Return receiver.username as receiverUsername , notification.counter as Cntr , notification.initiators as initiators , notification.authorName as authorUsername
                `
                ,
                {
                    id            : noti.id,
                    initiator     : noti.initiator, 
                    referenceId   : noti.referenceId,
                    body          : noti.body,
                    date          : Math.floor(Number(noti.date)),
                    referenceType : noti.referenceType
                });

                console.log("in creation")
                console.log(noti.referenceId)

                console.log("record length is :" + result.records.length)

                //update initiators and return the updated notification
                noti.author = result.records[0].get("authorUsername")
                console.log("author: " + noti.author)
                noti.initiatorsList = result.records[0].get("initiators")
                noti.initiatorsCntr = result.records[0].get("Cntr")
                noti.receiver = result.records[0].get("receiverUsername")
                return noti; 
            }   
           

        } catch (err) {
         console.error(`Error creating notification: ${err}`);
         throw err;
        }

    }


// Function to map database results to Notification objects


  public async getUserNotifications(username: string): Promise<Notification[]> {
    const session = dbDriver.session(); // Assuming dbDriver is your Neo4j driver instance

    try {
        const result = await session.run(
            `
            MATCH (u:User {username: $username})-[h:HAVE_NOTIFICATION]->(n:Notification)
            OPTIONAL MATCH (n)-[l:LIKE_POST_NOTI]-(p:Post)
            OPTIONAL MATCH (n)-[lol:LIKE_COMMENT_NOTI]-(C:Comment)
            RETURN u, h, n, p.id as LikereferenceId, C.id as CommentreferenceId
            `,
            { username: username }
        );

        const notifications: Notification[] = [];

        result.records.map(record => {
            const notification = new Notification();
            const user = record.get('u');
            const notificationNode = record.get('n');
            const likereferenceId = record.get('LikereferenceId');
            const commentreferenceId = record.get('CommentreferenceId');

            notification.id = notificationNode.properties.id;
            notification.date = notificationNode.properties.date;
            notification.initiator = notificationNode.properties.initiator;
            notification.body = notificationNode.properties.body;
            notification.author = notificationNode.properties.author;
            notification.receiver = user.properties.username;
            notification.initiatorsList = notificationNode.properties.initiators;
            notification.initiatorsCntr = notificationNode.properties.initiators.length;

            if (likereferenceId) {
                notification.referenceId = likereferenceId;
                notification.referenceType = 'post';
                notification.message = "liked your post";
            } else if (commentreferenceId) {
                notification.referenceId = commentreferenceId;
                notification.referenceType = 'comment';
                notification.message = "liked your comment";
            }

            notifications.push(notification);
        });
        return notifications;
    } catch (error) {
        console.error(`Error retrieving notifications for user ${username}: ${error}`);
        throw error;
    } finally {
        await session.close();
    }
}

}