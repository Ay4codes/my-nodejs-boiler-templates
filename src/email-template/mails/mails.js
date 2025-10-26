import { CONFIG } from "../../../config/index.js"
import Button from "../components/button.js"
import constants from "../constants/index.js"
import Layout from "../layout/default-layout.js"
const colors = constants.colors

class MailTemplates {
    
    welcomeUserEmail = (firstName, verificationLink) => {
        return (
            Layout(`
                <section>
                    <h3>Hi ${firstName} 👋</h3>
                    <p>Thank you for joining ${CONFIG.APP_NAME}. We're excited to have you on board. To complete your registration we need to verify your email.</p>
                    ${Button('Verify Your Email', verificationLink)}
                    <p>If the button above doesn't work, you can also click or copy the following link to your browser:</p>
                    <a style="display: block; color: ${colors.primary};" href="${verificationLink}">${verificationLink}</a>
                </section>
            `)
        )
    }


    onboardUserEmail = (firstName, setupLink) => {
        return (
            Layout(`
                <section>
                    <h3>Welcome, ${firstName}! 👋</h3>
                    <p>Your account for ${CONFIG.APP_NAME} has been created by an administrator. We're thrilled to have you on board!</p>
                    <p>To get started, please set up your account by creating a password using the link below:</p>
                    ${Button('Set Up Your Account', setupLink)}
                    <p>If the button above doesn't work, you can also click or copy the following link to your browser:</p>
                    <a style="display: block; color: ${colors.primary};" href="${setupLink}">${setupLink}</a>
                    <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                </section>
            `)
        )
    }


    onboardedUserEmail = (firstName) => {
        return (
            Layout(`
                <section>
                    <h3>Welcome, ${firstName}! 🎉</h3>
                    <p>Your account for ${CONFIG.APP_NAME} has been successfully created and is now active! We're thrilled to have you on board.</p>
                    <p>You can now log in and start exploring all the features ${CONFIG.APP_NAME} has to offer.</p>
                    <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                </section>
            `)
        )
    }


    emailVerificationEmail = (firstName, verificationLink) => {
        return (
            Layout(`
                <section>
                    <h3>Hi ${firstName} 👋</h3>
                    <p>To complete your registration we need to verify your email.</p>
                    ${Button('Verify Your Email', verificationLink)}
                    <p>If the button above doesn't work, you can also click or copy the following link to your browser:</p>
                    <a style="display: block; color: ${colors.primary};" href="${verificationLink}">${verificationLink}</a>
                </section>
            `)
        )
    }


    passwordResetRequestEmail = (firstName, verificationLink) => {
        return Layout(`
          <section>
            <h3>Hi ${firstName} 👋</h3>
            <p>We received a request to reset your password. Click the button below to get started.</p>
            ${Button('Reset Your Password', verificationLink)}
            <p>If the button above doesn't work, you can also click or copy the following link to your browser:</p>
            <a style="display: block; color: ${colors.primary};" href="${verificationLink}">${verificationLink}</a>
          </section>
        `);
    };

}

export default new MailTemplates