const nodemailer = require('nodemailer');
const { mailer } = require('../../config');
const config = require('../../config');
const logger = require("../logger");

class Mailer {

    constructor() {

        if (!Mailer.instance) {

            if (!mailer.HOST) return logger.error('SMTP-HOST required. --not Found')

            if (!mailer.PORT) return logger.error('SMTP-PORT required. --not Found')

            if (!mailer.DEFAULT_FROM) return logger.error('SMTP-USER required. --not Found')

            if (!mailer.PASSWORD) return logger.error('SMTP-PASSWORD required. --not Found')


            this.transporter = nodemailer.createTransport({

                host: mailer.HOST,

                port: mailer.PORT,
                
                secure: mailer.SECURE,
                
                auth: {

                    user: mailer.USER,

                    pass: mailer.PASSWORD,
                
                }

            });
    
            Mailer.instance = this;

        }
    
        return Mailer.instance;

    }


    async verifyConnection () {

        this.transporter.verify().then(() => {

            logger.info(`Connected to mailer server ${mailer.HOST}:${mailer.PORT}`);

        })

    }


    async sendMail (mailOptions) {

        mailOptions = {...mailOptions, from: mailOptions.from || mailer.DEFAULT_FROM}

        await this.transporter.sendMail(mailOptions).then((info) => {

            return {success: true, message:`Message sent: ${info.messageId}`}

        });

    }

}

module.exports = new Mailer