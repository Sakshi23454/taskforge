import nodemailer from "nodemailer"
import { env } from "../config/env"

export const sendEmail = ({ email, subject, message }: { email: string, subject: string, message: string }) => new Promise(async (resolve, reject) => {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: { user: env.email, pass: env.email_pass }
        })
        await transport.sendMail({
            to: email,
            subject: subject,
            // text: message,
            html: message,
        })
        resolve("email send success")
    } catch (error) {
        console.log(error)
        reject("unable to send email")
    }
})