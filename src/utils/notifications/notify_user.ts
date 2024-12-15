import { send } from "process";
import { NotifyUser } from "../../dto/notify_user";
import { logger } from "../logger";
// import { send_notification } from "./notification_sender";
import { sendEmail } from "./send_email";
// import { send_sms, send_sms_branded } from "./sms_sender";

export function notify_user(input: NotifyUser) {
    try {


        // // CASE 1 : Send Mobile Notification
        // if (input.Notification) {
        //     send_notification(input.Notification.to, input.Notification.title, input.Notification.body, input.Notification.data, input.Notification.role, input.Notification.user_id)
        // }
        // CASE 2 : Send Email to Admin
        if (input.Email) {
            for (let i = 0; i < input.Email.to_email.length; i++) {
                sendEmail(input.Email.to_email[0], input.Email.subject, input.Email.body, input.Email?.attachments)
            }
        }
        // CASE 3 : Send SMS
        // if (input.SMS) {

        //     if (input.SMS.service_type == 'branded') {
        //         for (let i = 0; i < input.SMS.to_phone_number.length; i++) {
        //             send_sms_branded(input.SMS.sms_body, input.SMS.to_phone_number[i])
        //         }

        //     }
        //     else if (input.SMS.service_type == 'jazz') {
        //         for (let i = 0; i < input.SMS.to_phone_number.length; i++) {
        //             send_sms(input.SMS.sms_body, input.SMS.to_phone_number[i])

        //         }
        //     }
        // }
    }
    catch (error: any) {
        logger.error(`Error Occured in [ Notify User ] Service with error message ${error.message} `)

    }
}
