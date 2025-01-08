import { apiErrorHandler } from '../handlers/errorHandler';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

export default class EmailTransport {

    mailTransporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            type: "OAuth2",
            user: "piyush.dholariya@gmail.com",
            accessToken: "ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x"
        }
    });

    constructor() { }

    async sentVerificationEmail(req: Request, res: Response) {
        try {
            const mailDetails = {
                from: 'xyz@gmail.com',
                to: 'piyush.dholariya@gmail.com',
                subject: 'Test mail',
                text: 'Node.js testing mail for doffair'
            };

            this.mailTransporter.sendMail(mailDetails, (err, data) => {
                if (err) {
                    console.log('Error Occurs', err);
                } else {
                    console.log('Email sent successfully', data);
                }
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Email sent failed.');
        }
    }
}
