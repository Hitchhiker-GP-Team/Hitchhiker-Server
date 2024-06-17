
import { DbHelper } from "../../db/DbHelper.js";
import { Notification } from "../Notification.js";
import { NotificationService } from "./NotificationService.js";
import { v4 as uuidv4 } from 'uuid';

export class likeCommentNotificationService implements NotificationService {
    
    async gnerateNotification(initiator : String, referenceId : String ): Promise<Notification> {

        const noti : Notification = {
            id: uuidv4(),
            referenceId : referenceId,
            initiator : initiator,
            referenceType : "comment",
            body : "liked your comment on ",
            date : 1 
        }

        const fullnoti = await DbHelper.NotificationNode.likeCommentNotification(noti)
        
        if ( (fullnoti.initiatorsCntr! - fullnoti.initiatorsList!.length) > 0) {
            fullnoti.message = fullnoti.initiatorsList![0] + " and " + (fullnoti.initiatorsCntr!-1) + " others " + fullnoti.body + fullnoti.author + "'s post"
        }else if (fullnoti.initiatorsCntr! == 1)
        {
            fullnoti.message = fullnoti.initiatorsList![0] + " " + fullnoti.body! +  fullnoti.author + "'s post"
        }else if(fullnoti.initiatorsCntr! ==2 )
        {
            fullnoti.message = fullnoti.initiatorsList![0] + " and " + fullnoti.initiatorsList![1] + " " + fullnoti.body  + fullnoti.author + "'s post"   
        }

        return fullnoti
    }
}

