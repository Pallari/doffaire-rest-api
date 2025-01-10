import nodemailer from 'nodemailer';
import { MAIL_AUTH_INFO } from '../constants/constants-info';
export default class EmailTransport {

    mailTransporter = nodemailer.createTransport({
        service: MAIL_AUTH_INFO.service,
        host: MAIL_AUTH_INFO.host,
        port: 587,
        secure: false,
        auth: {
            user: MAIL_AUTH_INFO.user,
            pass: MAIL_AUTH_INFO.pass,
        }
    });

    constructor() {
        this.sentVerificationEmail = this.sentVerificationEmail.bind(this);
    }

    async sentVerificationEmail(data, callback?) {
        try {
            const mailDetails = {
                from: 'admin@doffair.com',
                to: data.to,
                subject: data.subject,
                text: data.text
            };

            this.mailTransporter.sendMail(mailDetails, (err, data) => {
                if (err) {
                    callback(err, 'Error Occurs.');
                } else {
                    callback('Email sent successfully', data);
                }
            });
        } catch (error) {
            callback(error, 'Email sent failed.');
        }
    }
}
