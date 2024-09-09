import { CONFIG } from "../../../config/index.js"
import Button from "../components/button.js"
import constants from "../constants/index.js"
import Layout from "../layout/default-layout.js"
const colors = constants.colors

class MailTemplates {
    
    welcomeUserEmail = (firstname, code, verificationLink) => {
        return (
            Layout(`
                <section>
                    <h3>Hi ${firstname} 👋</h3>
                    <p>Thank you for joining ${CONFIG.APP_NAME}. We're excited to have you on board. To complete your registration we need to verify your email.</p>
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


    passwordResetRequestEmail = (firstname, verificationLink) => {
        return Layout(`
          <section>
            <h3>Hi ${firstname} 👋</h3>
            <p>We received a request to reset your password. Click the button below to get started.</p>
            ${Button('Reset Your Password', verificationLink)}
            <p>If the button above doesn't work, you can also click or copy the following link to your browser:</p>
            <a style="display: block; color: ${colors.primary};" href="${verificationLink}">${verificationLink}</a>
            <p> If you did not request for a password reset, please ignore this message. For further assistance contact us at <a href="mailto:${CONFIG.SUPPORT_EMAIL}" style="color: ${colors.primary};">${mailer.SUPPORT}</a>
          </section>
        `);
    };

}

export default new MailTemplates