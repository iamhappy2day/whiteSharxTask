import nodemailer from 'nodemailer';
import {config} from "../config";

export const sendEmail = async (options: any) => {
    // 1) create a transporter
    const transporter = nodemailer.createTransport({
        // @ts-ignore
        host: config.EMAIL_HOST,
        port: config.EMAIL_PORT,
        auth: {
            user: config.EMAIL_USERNAME,
            pass: config.EMAIL_PASSWORD
        }
    })
    // 2) Define the email options
    const mailOptions = {
        from: 'Sergei Revenko <hello@sergei.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
        //html
    };
    //3) send email
    await transporter.sendMail(mailOptions)
}

