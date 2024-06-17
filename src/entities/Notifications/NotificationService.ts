import { Notification } from "../Notification";

export interface NotificationService {

    notification? : Notification;
    gnerateNotification : (initiator : String, referenceId : String ) => Promise<Notification>;

}