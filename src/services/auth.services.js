const { BCRYPT_SALT, auth } = require("../../config");
const {User} = require("../models/user.model")
const ValidationSchema = require('../utils/validators.schema')
const bcrypt = require('bcrypt');
const TokenServices = require("./token.services");
const mailerServices = require("./mailer.services");

class AuthServices {

    async register (body) {

        const {error, value: data} = ValidationSchema.register.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const query = [{email: data.email}]

        const hashedPassword = bcrypt.hashSync(data.password, BCRYPT_SALT)

        const newUser = {first_name: data.firstname, last_name: data.lastname, email: data.email, password: hashedPassword}

        data.phone_number && (query.push({ phone_number: data.phone_number }), newUser.phone_number = data.phone_number);

        const userExist = await User.findOne({ $or: query})

        if (userExist) return {success: false, status: 409, message: `User already exist`}

        const user = await new User(newUser).save()

        const token = await TokenServices.generateAuthToken(user)

        const emailVerification = await TokenServices.genereteToken(user, auth.tokens_types.email_verification)

        await mailerServices.sendWelcomeEmail(user, emailVerification.data)

        return {success: true, status: 201, message: `User registeration successful`, data: {token: token.data, user: user}}

    }


    async login (body) {

        const { error, value: data } = ValidationSchema.login.validate(body);
    
        if (error) return { success: false, status: 400, message: error.message};
    
        const user = await User.findOne({ email: data.email }).select('+password');
    
        if (!user) return { success: false, status: 404, message: 'User does not exist', issue: '-user_not_found' };
    
        const verifyPassword = await bcrypt.compare(data.password, user.password);
    
        if (!verifyPassword) return { success: false, status: 401, message: 'Invalid credentials', issue: '-invalid_credentials' };
    
        if (user.account_disabled) return { success: false, status: 401, message: 'Account disabled. If you believe this is a mistake, please contact our support team for assistance.', issue: '-account_disabled' };
    
        const token = await TokenServices.generateAuthToken(user);
    
        if (!user.email_verified) {

            const emailVerification = await TokenServices.genereteToken(user, auth.tokens_types.email_verification)

            await mailerServices.sendEmailVerificationEmail(user, emailVerification.data)

            return { success: true, status: 200, message: 'Login successful', data: { token: token.data }, issue: '-email_not_verified' };
        
        }
    
        if (!user.identity_verified) return { success: true, status: 200, message: 'Login successful', data: { token: token.data }, issue: '-identity_not_verified' };

        return { success: true, status: 200, message: 'Login successful', data: { token: token.data }};
        
    }


    async refreshToken (headers) {

        const {error, value: data} = ValidationSchema.logout.validate(headers)

        if (error) return {success: false, status: 400, message: error.message}

        const refreshToken = await TokenServices.refreshAuthToken(data.refresh_token)

        if (!refreshToken.success) return {success: false, status: refreshToken.status, message: refreshToken.message}

        return {success: refreshToken.success, status: refreshToken.status, message: refreshToken.message, data: refreshToken.data, issue: refreshToken.issue}

    }


    async logout (headers) {

        const {error, value: data} = ValidationSchema.logout.validate(headers)

        if (error) return {success: false, status: 400, message: error.message}

        const revokeToken = await TokenServices.revokeRefreshToken(data.refresh_token)

        if (!revokeToken.success) return {success: revokeToken.success, status: revokeToken.status, message: revokeToken.message, issue: revokeToken.issue}

        return {success: true, status: 200, message: 'Logout successful'}

    }


    async verifyEmail (body) {

        const {error, value: data} = ValidationSchema.verifyEmail.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const user = await User.findOne({_id: data.user_id})

        if (!user) return { success: false, status: 404, message: 'User does not exist' };

        if (user.email_verified) return {success: false, status: 400, message: 'Email is already verified'}

        const verifyToken = await TokenServices.verifyToken(user, auth.tokens_types.email_verification, data.code, data?.token)

        if (!verifyToken.success) return {success: false, status: verifyToken.status, message: verifyToken.message, issue: verifyToken.issue}

        data.with_identity ? await User.updateOne({_id: data.user_id}, {$set: {email_verified: true, identity_verified: true}}) : await User.updateOne({_id: data.user_id}, {$set: {email_verified: true}})
        
        return {success: true, status: 200, message: verifyToken.message}

    }


    async requestPasswordReset (body) {

        const {error, value: data} = ValidationSchema.requestPasswordReset.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const user = await User.findOne({email: data.email})

        if (!user) return { success: false, status: 404, message: 'User does not exist'};

        const emailVerification = await TokenServices.genereteToken(user, auth.tokens_types.password_reset)
        
        await mailerServices.sendPasswordResetRequestEmail(user, emailVerification.data)

        return {success: true, status: 200, message: 'Password reset request successful'}

    }


    async resetPassword (body) {

        const {error, value: data} = ValidationSchema.resetPassword.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const user = await User.findOne({email: data.email})

        if (!user) return { success: false, status: 404, message: 'User does not exist' };

        const verifyToken = await TokenServices.verifyToken(user, auth.tokens_types.password_reset, data.code, data.token)

        if (!verifyToken.success) return {success: false, status: verifyToken.status, message: verifyToken.message}
        
        const hashedPassword = bcrypt.hashSync(data.new_password, BCRYPT_SALT)

        await User.updateOne({_id: user._id}, {$set: {password: hashedPassword}})

        return {success: true, status: 200, message: "Password reset successful"}

    }

}

module.exports = new AuthServices