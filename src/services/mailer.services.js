import { CONFIG } from '../../config/index.js'
import mailer from '../connections/mailer.js'
import MailsTemplates from '../email-template/mails/mails.js'

class MailServices {

    async sendWelcomeEmail (user, verification) {

        return mailer.sendMail({

            to: user.email,

            subject: `Welcome to ${CONFIG.APP_NAME}`,

            html:  MailsTemplates.welcomeUserEmail(user.first_name, verification.code, CONFIG.HOST.LANDING_BASE_URL + `/verify-email?code=${verification.code}&token=${verification.token}`),
            
        })
        
    }


    async sendEmailVerificationEmail (user, verification) {

        return mailer.sendMail({

            to: user.email,

            subject: `Verify your email address`,

            html:  MailsTemplates.emailVerificationEmail(user.first_name, verification.code, CONFIG.HOST.LANDING_BASE_URL + `/verify-email?code=${verification.code}&token=${verification.token}`),
            
        })
        
    }


    async sendPasswordResetRequestEmail (user, verification) {

        return mailer.sendMail({

            to: user.email,

            subject: `Password Reset Request`,

            html:  MailsTemplates.passwordResetRequestEmail(user.first_name, CONFIG.HOST.LANDING_BASE_URL + `/verify-email?code=${verification.code}&token=${verification.token}`),
            
        })
        
    }

}

export default new MailServices