
import { mailtrapClient,sender } from "../lib/mailTrap.js";
import { createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplates.js";


export const sendWelcomeEmail = async (email, name, profileUrl ) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to UnLinked",
            html:createWelcomeEmailTemplate(name, profileUrl),
            category: "Welcome"
        })

        console.log("Welcome Email send successfully",response);
    } catch (error) {
        throw error;    
    }
}

export const sendCommentNotificationEmail = async (email,recipientName,commenterName,postUrl,commentContent) => {
    const recipient = [{email}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "New Comment on Your Post",
            html:createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
            category: "comment_notification" 
        })

        console.log("Comment Notification Email send successfully",response);
    } catch (error) {
        throw error;
    }
}

export const sendConnectionAcceptedEmail = async(senderEmail, senderName, recipientName, profileUrl) => {
    const recipient = [{email : senderEmail}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `${recipientName} accepted your connection request`,
            html:createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
            category: "connection_accepted"
        })
    } catch (error) {
        throw error;
    }
}