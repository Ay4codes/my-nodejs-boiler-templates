import { CONFIG } from '../../config/index.js'
import mailer from '../connections/mailer.js'
import MailsTemplates from '../email-template/mails/mails.js'

class MailServices {

    async sendOnboardingEmail (user, redirect_url, verification) {

        return mailer.sendMail({

            to: user.email,

            subject: `Welcome to ${CONFIG.APP_NAME}`,

            html:  MailsTemplates.onboardUserEmail(user.first_name, `${redirect_url}?target=${user?._id}&code=${verification.code}&token=${verification.token}`),
            
        })
        
    }

    async sendOnboardedEmail (user) {

        return mailer.sendMail({

            to: user.email,

            subject: `Welcome Aboard, ${user?.first_name}!`,

            html:  MailsTemplates.onboardedUserEmail(user.first_name),
            
        })
        
    }

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


    async sendPasswordResetRequestEmail (user, redirect_url, verification) {

        return mailer.sendMail({

            to: user.email,

            subject: `Password Reset Request`,

            html:  MailsTemplates.passwordResetRequestEmail(user.first_name, `${redirect_url}?code=${verification.code}&token=${verification.token}`),
            
        })
        
    }

}

export default new MailServices