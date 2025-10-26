import bcrypt from 'bcrypt'
import { CONFIG } from '../../config/index.js';
import User from '../models/user.model.js';
import ValidationSchema from '../utils/validators.schema.js';
import TokenServices from './token.services.js';
import mailerServices from './mailer.services.js'
import RoleHistory from '../models/role.history.model.js';
import Role from '../models/role.model.js';

class AuthServices {

    async register (body) {

        const {error, value: data} = ValidationSchema.register.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const query = [{email: data.email}]

        const hashedPassword = bcrypt.hashSync(data.password, CONFIG.AUTH.BCRYPT_SALT)

        const newUser = {firstName: data.firstName, lastName: data.lastName, email: data.email, country: data.country, password: hashedPassword}

        data.phoneNumber && (query.push({ phoneNumber: data.phoneNumber }), newUser.phoneNumber = data.phoneNumber);

        data.sex && (newUser.sex = data.sex);

        const userExist = await User.findOne({$or: query})

        if (userExist) return {success: false, status: 409, message: `Phone number or email already exist`}

        const defaultRole = await Role.findOne({name: 'USER'})

        if (!defaultRole) return {success: false, status: 500, message: 'User role not found', issue: '-role_not_found'}
        
        newUser.roles = [defaultRole._id]

        const user = await new User(newUser).save()

        await new RoleHistory({user: user._id, role: defaultRole._id, action: 'ASSIGN'}).save()

        const emailVerification = await TokenServices.genereteToken(user, CONFIG.AUTH.TOKEN_TYPES.emailVerification)

        await mailerServices.sendWelcomeEmail(user, data.redirectUrl, emailVerification.data)

        return {success: true, status: 201, message: `User registeration successful`, data: {user: user}}

    }


    async login (body) {

        const { error, value: data } = ValidationSchema.login.validate(body);
    
        if (error) return { success: false, status: 400, message: error.message};
    
        const user = await User.findOne({email: data.email}).select('+password');
    
        if (!user) return { success: false, status: 404, message: 'User does not exist', issue: '-user-not-found' };

        if (user.status === 'DISABLED' || user.status === 'INACTIVE') return { success: false, status: 401, message: 'Account disabled or inactive', issue: '-account-disabled' };
    
        const verifyPassword = await bcrypt.compare(data.password, user.password);
    
        if (!verifyPassword) return { success: false, status: 401, message: 'Invalid credentials', issue: '-invalid-credentials' };
    
        if (user.account_disabled) return { success: false, status: 401, message: 'Account disabled. If you believe this is a mistake, please contact our support team for assistance.', issue: '-account_disabled' };
    
        const token = await TokenServices.generateAuthToken(user);

        if (user.status === 'PENDING') {

            const emailVerification = await TokenServices.genereteToken(user, CONFIG.AUTH.TOKEN_TYPES.emailVerification)

            await mailerServices.sendEmailVerificationEmail(user, data?.redirectUrl, emailVerification.data)

            return { success: true, status: 403, message: 'Email not verified', issue: '-email-not-verified' };
        
        }
    
        return { success: true, status: 200, message: 'Login successful', data: {...token.data}};
        
    }


    async refreshToken (headers) {

        const {error, value: data} = ValidationSchema.logout.validate(headers)

        if (error) return {success: false, status: 400, message: error.message}

        const refreshToken = await TokenServices.refreshAuthToken(data.refreshToken)

        if (!refreshToken.success) return {success: false, status: refreshToken.status, message: refreshToken.message}

        return {success: refreshToken.success, status: refreshToken.status, message: refreshToken.message, data: refreshToken.data, issue: refreshToken.issue}

    }


    async logout (headers) {

        const {error, value: data} = ValidationSchema.logout.validate(headers)

        if (error) return {success: false, status: 400, message: error.message}

        const revokeToken = await TokenServices.revokeRefreshToken(data.refreshToken)

        if (!revokeToken.success) return {success: revokeToken.success, status: revokeToken.status, message: revokeToken.message, issue: revokeToken.issue}

        return {success: true, status: 200, message: 'Logout successful'}

    }


    async verifyEmail (body) {

        const {error, value: data} = ValidationSchema.verifyEmail.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const verifyToken = await TokenServices.verifyToken(CONFIG.AUTH.TOKEN_TYPES.emailVerification, data?.token)

        if (!verifyToken.success) return {success: false, status: verifyToken.status, message: verifyToken.message, issue: verifyToken.issue}

        const user = verifyToken.data?.user

        await User.updateOne({_id: user}, {$set: {email_verified: true, status: 'ACTIVE', updatedBy: 'system'}})
        
        return {success: true, status: 200, message: verifyToken.message}

    }


    async requestPasswordReset (body) {

        const {error, value: data} = ValidationSchema.requestPasswordReset.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const user = await User.findOne({email: data.email, status: 'ACTIVE'})

        if (!user) return { success: false, status: 404, message: 'User does not exist'};

        const passwordResetRequest = await TokenServices.genereteToken(user, CONFIG.AUTH.TOKEN_TYPES.passwordReset)
        
        await mailerServices.sendPasswordResetRequestEmail(user, data?.redirectUrl, passwordResetRequest.data)

        return {success: true, status: 200, message: 'Password reset request successful'}

    }


    async resetPassword (body) {

        const {error, value: data} = ValidationSchema.resetPassword.validate(body)

        if (error) return {success: false, status: 400, message: error.message}

        const verifyToken = await TokenServices.verifyToken(CONFIG.AUTH.TOKEN_TYPES.passwordReset, data.token)

        if (!verifyToken.success) return {success: false, status: verifyToken.status, message: verifyToken.message}

        const user = verifyToken?.data?.user

        const hashedPassword = bcrypt.hashSync(data.newPassword, CONFIG.AUTH.BCRYPT_SALT)

        await User.updateOne({_id: user}, {$set: {password: hashedPassword}})

        return {success: true, status: 200, message: "Password reset successful"}

    }

}

export default new AuthServices