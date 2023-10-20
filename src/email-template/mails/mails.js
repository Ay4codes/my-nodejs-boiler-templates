const { APP_NAME } = require("../../../config")
const { Button } = require("../components/button")
const {colors} = require("../constants")
const Layout = require("../layout/default-layout")

class MailTemplates {
    
    welcomeUserEmail = (firstname, code, verificationLink) => {
        return (
            Layout(`
                <section>
                    <h3>Hi ${firstname} 👋</h3>
                    <p>Thank you for joining ${APP_NAME}. We're excited to have you on board. To complete your registration we need to verify your email.</p>
                    <p>Your email verification code is <b>${code}</b> or click the button below to verify your email.</p>
                    ${Button('Verify Your Email', verificationLink)}
                    <p>If the button above doesn't work, you can also click or copy the following link to your browser:</p>
                    <a style="display: block; color: ${colors.primary};" href="${verificationLink}">${verificationLink}</a>
                </section>
            `)
        )
    }


    emailVerificationEmail = (firstname, code, verificationLink) => {
        return (
            Layout(`
                <section>
                    <h3>Hi ${firstname} 👋</h3>
                    <p>To complete your registration we need to verify your email.</p>
                    <p>Your email verification code is <b>${code}</b> or click the button below to verify your email.</p>
                    ${Button('Verify Your Email', verificationLink)}
                    <p>If the button above doesn't work, you can also click or copy the following link to your browser:</p>
                    <a style="display: block; color: ${colors.primary};" href="${verificationLink}">${verificationLink}</a>
                </section>
            `)
        )
    }

}

module.exports = new MailTemplates