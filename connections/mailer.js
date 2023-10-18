const nodemailer = require('nodemailer');
const { mailer } = require('../config');
const config = require('../config');
const logger = require("../src/logger");

class Mailer {

    constructor() {

        if (!Mailer.instance) {

            this.transporter = nodemailer.createTransport({

                host: mailer.HOST,

                port: mailer.PORT,
                
                secure: mailer.SECURE,
                
                auth: {

                    user: mailer.DEFAULT_FROM,

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