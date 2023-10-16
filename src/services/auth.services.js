const { BCRYPT_SALT } = require("../../config");
const {User} = require("../models/user.model")
const ValidationSchema = require('../utils/validators.schema')
const bcrypt = require('bcrypt');
const tokenServices = require("./token.services");
const config = require("../../config");

class authServices {

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

        const token = await tokenServices.generateAuthToken(user)

        return {success: true, status: 201, message: `User registeration successful`, data: {token: token.data, user: user}}

    }


    async login (body) {

        const { error, value: data } = ValidationSchema.login.validate(body);
    
        if (error) return { success: false, status: 400, message: error.message, issue: '-validation_error' };
    
        const user = await User.findOne({ email: data.email }).select('+password');
    
        if (!user) return { success: false, status: 404, message: 'User does not exist', issue: '-user_not_found' };
    
        const verifyPassword = await bcrypt.compare(data.password, user.password);
    
        if (!verifyPassword) return { success: false, status: 401, message: 'Invalid credentials', issue: '-invalid_credentials' };
    
        if (user.account_disabled) return { success: false, status: 403, message: 'Account disabled. If you believe this is a mistake, please contact our support team for assistance.', issue: '-account_disabled' };
    
        const token = await tokenServices.generateAuthToken(user);
    
        if (!user.email_verified) return { success: true, status: 200, message: 'Login successful', data: { token: token.data }, issue: '-email_not_verified' };
    
        if (!user.identity_verified) return { success: true, status: 200, message: 'Login successful', data: { token: token.data }, issue: '-identity_not_verified' };
        
    }


    async refreshToken (headers) {

        const {error, value: data} = ValidationSchema.logout.validate(headers)

        if (error) return {success: false, status: 400, message: error.message}

        const refreshToken = await tokenServices.refreshAuthToken(data.refresh_token)

        if (!refreshToken.success) return {success: false, status: refreshToken.status, message: refreshToken.message}

        return {success: refreshToken.success, status: refreshToken.status, message: refreshToken.message, data: refreshToken.data}

    }


    async logout (headers) {

        const {error, value: data} = ValidationSchema.logout.validate(headers)

        if (error) return {success: false, status: 400, message: error.message}

        const revokeToken = await tokenServices.revokeRefreshToken(data.refresh_token)

        if (!revokeToken.success) return {success: revokeToken.success, status: revokeToken.status, message: revokeToken.message}

        return {success: true, status: 200, message: 'Logout successful'}

    }


    async verifyEmail (body) {

        const d = '' // WIP

    }

}

module.exports = new authServices