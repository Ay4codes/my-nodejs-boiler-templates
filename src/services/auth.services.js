import bcrypt from 'bcrypt'
import { CONFIG } from '../../config/index.js';
import User from '../models/user.model.js';
import ValidationSchema from '../utils/validators.schema.js';
import TokenServices from './token.services.js';
import mailerServices from './mailer.services.js'
import RoleHistory from '../models/role.history.model.js';

class AuthServices {

    async register (body) {

        const {error, value: data} = ValidationSchema.register.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const query = [{email: data.email}]

        const hashedPassword = bcrypt.hashSync(data.password, CONFIG.AUTH.BCRYPT_SALT)

        const newUser = {first_name: data.firstname, last_name: data.lastname, email: data.email, country: data.country, password: hashedPassword}

        data.phone_number && (query.push({ phone_number: data.phone_number }), newUser.phone_number = data.phone_number);

        const userExist = await User.findOne({$or: query})

        if (userExist) return {success: false, status: 409, message: `Phone number or email already exist`}

        const defaultRole = await Role.findOne({name: 'user'})

        if (!defaultRole) return {success: false, status: 500, message: 'User role not found', issue: '-role_not_found'}
        
        newUser.roles = [defaultRole._id]

        const user = await new User(newUser).save()

        await new RoleHistory({user: user._id, role: defaultRole._id, action: 'assign'}).save()

        const token = await TokenServices.generateAuthToken(user)

        const emailVerification = await TokenServices.genereteToken(user, CONFIG.AUTH.TOKEN_TYPES.email_verification)

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
    
        if (!user.status === 'pending') {

            const emailVerification = await TokenServices.genereteToken(user, CONFIG.AUTH.TOKEN_TYPES.email_verification)

            await mailerServices.sendEmailVerificationEmail(user, emailVerification.data)

            return { success: true, status: 200, message: 'Login successful', data: { token: token.data }, issue: '-email_not_verified' };
        
        }
    
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

        const user = await User.findOne({_id: data.user})

        if (!user) return { success: false, status: 404, message: 'User does not exist' };

        if (user.email_verified) return {success: false, status: 400, message: 'Email is already verified'}

        const verifyToken = await TokenServices.verifyToken(user, CONFIG.AUTH.TOKEN_TYPES.email_verification, data.code, data?.token)

        if (!verifyToken.success) return {success: false, status: verifyToken.status, message: verifyToken.message, issue: verifyToken.issue}

        await User.updateOne({_id: data.user}, {$set: {email_verified: true, status: 'active', updatedBy: 'system'}})
        
        return {success: true, status: 200, message: verifyToken.message}

    }


    async requestPasswordReset (body) {

        const {error, value: data} = ValidationSchema.requestPasswordReset.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const user = await User.findOne({email: data.email})

        if (!user) return { success: false, status: 404, message: 'User does not exist'};

        const passwordResetRequest = await TokenServices.genereteToken(user, CONFIG.AUTH.TOKEN_TYPES.password_reset)
        
        await mailerServices.sendPasswordResetRequestEmail(user, data?.redirect_url, passwordResetRequest.data)

        return {success: true, status: 200, message: 'Password reset request successful'}

    }


    async resetPassword (body) {

        const {error, value: data} = ValidationSchema.resetPassword.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const user = await User.findOne({email: data.email})

        if (!user) return { success: false, status: 404, message: 'User does not exist' };

        const verifyToken = await TokenServices.verifyToken(user, CONFIG.AUTH.TOKEN_TYPES.password_reset, data.code, data.token)

        if (!verifyToken.success) return {success: false, status: verifyToken.status, message: verifyToken.message}
        
        const hashedPassword = bcrypt.hashSync(data.new_password, CONFIG.AUTH.BCRYPT_SALT)

        await User.updateOne({_id: user._id}, {$set: {password: hashedPassword}})

        return {success: true, status: 200, message: "Password reset successful"}

    }

}

export default new AuthServices