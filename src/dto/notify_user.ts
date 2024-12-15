export interface NotifyUser {
    Email?: SendEmail,
}
export interface SendEmail {
    subject: string,
    body: string,
    to_email: Array<string>
    attachments?: Array<any>
}