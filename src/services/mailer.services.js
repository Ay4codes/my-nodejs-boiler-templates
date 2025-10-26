import { CONFIG } from '../../config/index.js'
import mailer from '../connections/mailer.js'
import MailsTemplates from '../email-template/mails/mails.js'
import logger from '../logger/index.js'

class MailServices {

    async sendOnboardingEmail (user, redirectUrl, verification) {
        
        const finalUrl = `${redirectUrl}?token=${verification.token}`
        
        console.log(finalUrl)

        return mailer.sendMail({

            to: user.email,

            subject: `Welcome to ${CONFIG.APP_NAME}`,

            html:  MailsTemplates.onboardUserEmail(user.firstName, finalUrl),
            
        })
        
    }

    async sendOnboardedEmail (user) {

        return mailer.sendMail({

            to: user.email,

            subject: `Welcome Aboard, ${user?.firstName}!`,

            html:  MailsTemplates.onboardedUserEmail(user.firstName),
            
        })
        
    }

    async sendWelcomeEmail (user, redirectUrl, verification) {

        const finalUrl = `${redirectUrl}?&token=${verification.token}`

        console.log(finalUrl)

        return mailer.sendMail({

            to: user.email,

            subject: `Welcome to ${CONFIG.APP_NAME}`,

            html:  MailsTemplates.welcomeUserEmail(user.firstName, finalUrl),
            
        })
        
    }


    async sendEmailVerificationEmail (user, redirectUrl, verification) {

        const finalUrl = `${redirectUrl}?token=${verification.token}`

        console.log(finalUrl)

        return mailer.sendMail({

            to: user.email,

            subject: `Verify your email address`,

            html:  MailsTemplates.emailVerificationEmail(user.firstName, finalUrl),
            
        })
        
    }


    async sendPasswordResetRequestEmail (user, redirectUrl, verification) {

        const finalUrl = `${redirectUrl}?&token=${verification.token}`

        console.log(finalUrl)

        return mailer.sendMail({

            to: user.email,

            subject: `Password Reset Request`,

            html:  MailsTemplates.passwordResetRequestEmail(user.firstName, finalUrl),
            
        })
        
    }

}

export default new MailServices