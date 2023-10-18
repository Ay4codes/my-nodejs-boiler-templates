const mailer = require("../../connections/mailer")
const WelcomeUserEmail = require("../email-template/mails/welcome-user")

class MailServices {

    async sendWelcomeEmail (user) {

        return mailer.sendMail({

            to: user.email,

            subject: "Hello ✔",

            html: WelcomeUserEmail(user.first_name),
            
        })
        
    }

}

module.exports = new MailServices