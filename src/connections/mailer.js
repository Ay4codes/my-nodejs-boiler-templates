import nodemailer from 'nodemailer'
import logger from '../logger/index.js'
import { CONFIG } from '../../config/index.js'
const mailer = CONFIG.MAILER

class Mailer {

    constructor() {

        if (!Mailer.instance) {

            if (!mailer.SMTP_HOST) return logger.error('SMTP-HOST required. --not Found')

            if (!mailer.SMTP_PORT) return logger.error('SMTP-PORT required. --not Found')

            if (!CONFIG.DEFAULT_EMAIL_FROM) return logger.error('SMTP-USER required. --not Found')

            if (!mailer.SMTP_PASSWORD) return logger.error('SMTP-PASSWORD required. --not Found')


            this.transporter = nodemailer.createTransport({

                host: mailer.SMTP_HOST,

                port: mailer.SMTP_PORT,
                
                secure: mailer.SMTP_SECURE,
                
                auth: {

                    user: mailer.SMTP_USER,

                    pass: mailer.SMTP_PASSWORD,
                
                }

            });
    
            Mailer.instance = this;

        }
    
        return Mailer.instance;

    }


    async verifyConnection () {

        this.transporter.verify().then(() => {

            logger.info(`Connected to mailer server ${mailer.SMTP_HOST}:${mailer.SMTP_PORT}`);

        })

    }


    async sendMail (mailOptions) {

        mailOptions = {...mailOptions, from: mailOptions.from || mailer.DEFAULT_EMAIL_FROM}

        await this.transporter.sendMail(mailOptions).then((info) => {

            return {success: true, message:`Message sent: ${info.messageId}`}

        });

    }

}

export default new Mailer