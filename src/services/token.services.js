import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { CONFIG } from '../../config/index.js'
import CustomDate from '../utils/date.js'
import Token from '../models/token.model.js'
import User from '../models/user.model.js'

const AUTH = CONFIG.AUTH

class TokenServices {
    
    async generateAuthToken(user) {
    
        const refreshToken = crypto.randomBytes(32).toString("hex")
    
        const hashedRefreshToken = bcrypt.hashSync(refreshToken, AUTH.BCRYPT_SALT)
    
        await new Token({user: user._id, token: hashedRefreshToken, type: AUTH.TOKEN_TYPES.refresh, expiredAt: CustomDate.now() + AUTH.REFRESH_TOKEN_EXPIRES_IN}).save()

        const accessTokenJwt = jwt.sign({ user_id: user._id, roles: user.roles.map(r => r._id.toString()), email: user.email }, AUTH.JWT_SECRET, { expiresIn: AUTH.TOKEN_EXPIRES_IN / 1000 })

        const refreshTokenJwt = jwt.sign({ user_id: user._id }, AUTH.JWT_SECRET, { expiresIn: AUTH.REFRESH_TOKEN_EXPIRES_IN / 1000 })

        return {success: true, status: 200, data: {token: accessTokenJwt, refresh_token: refreshTokenJwt, raw_refresh_token: refreshToken}}
    
    }

    generateOtp(length) {

        const otp = crypto.randomBytes(2).readUInt16BE(0) % 100000;
        
        const code = otp.toString().padStart(length, (Math.floor(Math.random() * 9) + 1).toString());

        return {success: true, status: 200, data: {code: code}}

    }

    async refreshAuthToken(refresh_token_jwt, refreshToken) {
        
        const refreshTokenValue = await this.decodeToken(refresh_token_jwt)
        
        if (!refreshTokenValue.status) return {success: false, status: 401, message: 'Refresh token is expired', issue: refreshTokenValue.issue}
        
        const token = await Token.findOne({user: refreshTokenValue.user.user_id, type: AUTH.TOKEN_TYPES.refresh, expiredAt: {$gt: CustomDate.now()}})

        if (!token) return {success: false, status: 401, message: 'Refresh token is expired', issue: '-token_expired'}
        
        const verifyToken = await bcrypt.compare(refreshToken, token.token)
        
        if (!verifyToken) return {success: false, status: 401, message: 'Invalid refresh token', issue: '-token_invalid'}
        
        await Token.deleteOne({_id: token._id})
        
        const user = await User.findOne({_id: refreshTokenValue.user.user_id}).populate('roles')
        
        if (!user) return {success: false, status: 404, message: 'User not found'}
        
        return await this.generateAuthToken(user)
    
    }

    async revokeRefreshToken(refresh_token_jwt, refreshToken) {
        
        const refreshTokenValue = await this.decodeToken(refresh_token_jwt)
        
        if (!refreshTokenValue.status) return {success: false, status: 401, message: 'Refresh token is expired', issue: refreshTokenValue.issue}
        
        const token = await Token.findOne({user: refreshTokenValue.user.user_id, type: AUTH.TOKEN_TYPES.refresh, expiredAt: {$gt: CustomDate.now()}})

        if (!token) return {success: false, status: 401, message: 'Refresh token is expired', issue: '-token_expired'}
        
        const verifyToken = await bcrypt.compare(refreshToken, token.token)
        
        if (!verifyToken) return {success: false, status: 401, message: 'Invalid refresh token', issue: '-token_invalid'}
        
        await Token.deleteOne({_id: token._id})
        
        return {success: true, status: 200, message: 'Refresh token revoked successfully'}
    
    }

    async genereteToken(user, token_type) {

        await Token.deleteMany({user: user._id, type: token_type})

        const code = await this.generateOtp(5)

        const token = crypto.randomBytes(32).toString("hex")

        const hashedCode = bcrypt.hashSync(code.data.code, AUTH.BCRYPT_SALT)

        const hashedToken = bcrypt.hashSync(token, AUTH.BCRYPT_SALT)

        await new Token({code: hashedCode, token: hashedToken, user: user._id, type: token_type, expiredAt: CustomDate.now() + AUTH.TOKEN_EXPIRES_IN}).save()

        return {success: true, status: 200, data: {code: code.data.code, token: token}}

    }

    async verifyToken(user, token_type, code, token) {
        
        const findToken = await Token.findOne({user: user._id, type: token_type, expiredAt: {$gt: CustomDate.now()}})
        
        if (!findToken) return {success: false, status: 401, message: "Code or token is expired", issue: '-token_expired'}
        
        const verifyCode = await bcrypt.compare(code, findToken.code)
        
        const verifyToken = token ? await bcrypt.compare(token, findToken.token) : false
        
        if (!token) {
        
            if (!verifyCode) return {success: false, status: 401, message: 'Invalid code', issue: '-code_invalid'}
        
            await Token.deleteOne({_id: findToken._id})
        
            return {success: true, status: 200, message: 'Code verified successfully'}
        
        }
        
        if (!verifyToken || !verifyCode) return {success: false, status: 401, message: 'Invalid URL', issue: '-url_expired'}
        
        await Token.deleteOne({_id: findToken._id})
        
        return {success: true, status: 200, message: 'URL verified successfully'}
    
    }

    decodeToken(token) {
        
        try {
        
            const decoded = jwt.verify(token, AUTH.JWT_SECRET)
        
            return {status: true, user: decoded}
        
        } catch (err) {
        
            return {status: false, user: null, issue: err.name === 'TokenExpiredError' ? '-token_expired' : '-token_invalid'}
        
        }
    
    }

}

export default new TokenServices