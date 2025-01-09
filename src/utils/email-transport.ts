import { apiErrorHandler, apiSuccessHandler } from '../handlers/errorHandler';
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { MAIL_AUTH_INFO } from '../constants/constants-info';

export default class EmailTransport {

    mailTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: MAIL_AUTH_INFO.user,
            clientId: MAIL_AUTH_INFO.clientId,
            clientSecret: MAIL_AUTH_INFO.clientSecret,
            refreshToken: MAIL_AUTH_INFO.refreshToken,
            accessToken: MAIL_AUTH_INFO.accessToken,
            expires: MAIL_AUTH_INFO.expires
        }
    });

    constructor() {
        this.sentVerificationEmail = this.sentVerificationEmail.bind(this);
    }

    async sentVerificationEmail(req: Request, res: Response) {
        try {
            const mailDetails = {
                from: 'admin@doffair.com',
                to: 'piyush.dholariya@gmail.com',
                subject: 'Test mail',
                text: 'Node.js testing mail for doffair'
            };

            this.mailTransporter.sendMail(mailDetails, (err, data) => {
                if (err) {
                    apiErrorHandler(err, req, res, 'Error Occurs.');
                } else {
                    apiSuccessHandler(res, 'Email sent successfully', data);
                }
            });
        } catch (error) {
            apiErrorHandler(error, req, res, 'Email sent failed.');
        }
    }
}
