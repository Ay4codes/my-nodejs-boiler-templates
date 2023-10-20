const { domain, APP_NAME } = require("../../config")
const mailer = require("../connections/mailer")
const MailsTemplates = require('../email-template/mails/mails')

class MailServices {

    async sendWelcomeEmail (user, verification) {

        return mailer.sendMail({

            to: user.email,

            subject: `Welcome to ${APP_NAME}`,

            html:  MailsTemplates.welcomeUserEmail(user.first_name, verification.code, domain.LANDING_URL + `/verify-email?code=${verification.code}&token=${verification.token}`),
            
        })
        
    }

    async sendEmailVerificationEmail (user, verification) {

        return mailer.sendMail({

            to: user.email,

            subject: `Verify your email address`,

            html:  MailsTemplates.emailVerificationEmail(user.first_name, verification.code, domain.LANDING_URL + `/verify-email?code=${verification.code}&token=${verification.token}`),
            
        })
        
    }

}

module.exports = new MailServices