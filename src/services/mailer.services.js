const { domain, APP_NAME } = require("../../config")
const mailer = require("../connections/mailer")
const WelcomeUserEmail = require("../email-template/mails/welcome-user")

class MailServices {

    async sendWelcomeEmail (user, verification) {

        return mailer.sendMail({

            to: user.email,

            subject: `Welcome to ${APP_NAME}`,

            html: WelcomeUserEmail(user.first_name, verification.code, domain.LANDING_URL + `/verify-email?code=${verification.code}&token=${verification.token}`),
            
        })
        
    }

}

module.exports = new MailServices