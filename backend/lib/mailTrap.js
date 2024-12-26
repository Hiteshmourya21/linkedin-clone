import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const Token = process.env.MAILTRAP_TOKEN;

export const mailtrapClient = new MailtrapClient({
    token : Token
})

export const sender = {
    email : process.env.EMAIL_FROM,
    name : process.env.EMAIL_FROM_NAME
} 