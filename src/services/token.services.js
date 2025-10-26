import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { CONFIG } from '../../config/index.js'
import CustomDate from '../utils/date.js'
import Token from '../models/token.model.js'
import User from '../models/user.model.js'

const AUTH = CONFIG.AUTH

const ENCRYPTION_KEY = Buffer.from(AUTH.ENCRYPTION_SECRET, 'hex')

if (ENCRYPTION_KEY.length !== 32) throw new Error('AUTH.ENCRYPTION_SECRET must be a 32-byte hex string (64 hex chars)')

class TokenServices {
    
    async generateAuthToken(user) {
    
        const refreshToken = crypto.randomBytes(32).toString("hex")
    
        const hashedRefreshToken = bcrypt.hashSync(refreshToken, AUTH.BCRYPT_SALT)
    
        await new Token({user: user._id, token: hashedRefreshToken, type: AUTH.TOKEN_TYPES.refresh, expiredAt: CustomDate.now() + AUTH.REFRESH_TOKEN_EXPIRES_IN}).save()

        const accessTokenJwt = jwt.sign({ user_id: user._id, roles: user.roles.map(r => r._id.toString()), email: user.email }, AUTH.JWT_SECRET, { expiresIn: AUTH.TOKEN_EXPIRES_IN / 1000 })

        const refreshTokenJwt = jwt.sign({ user_id: user._id }, AUTH.JWT_SECRET, { expiresIn: AUTH.REFRESH_TOKEN_EXPIRES_IN / 1000 })

        return {success: true, status: 200, data: {token: accessTokenJwt, refreshToken: refreshTokenJwt, raw_refresh_token: refreshToken}}
    
    }

    generateOtp(length) {

        const otp = crypto.randomBytes(2).readUInt16BE(0) % 100000;
        
        const code = otp.toString().padStart(length, (Math.floor(Math.random() * 9) + 1).toString());

        return {success: true, status: 200, data: {code: code}}

    }

    async refreshAuthToken(refreshTokenJwt, refreshToken) {
        
        const refreshTokenValue = await this.decodeToken(refreshTokenJwt)
        
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

    async revokeRefreshToken(refreshTokenJwt, refreshToken) {
        
        const refreshTokenValue = await this.decodeToken(refreshTokenJwt)
        
        if (!refreshTokenValue.status) return {success: false, status: 401, message: 'Refresh token is expired', issue: refreshTokenValue.issue}
        
        const token = await Token.findOne({user: refreshTokenValue.user.user_id, type: AUTH.TOKEN_TYPES.refresh, expiredAt: {$gt: CustomDate.now()}})

        if (!token) return {success: false, status: 401, message: 'Refresh token is expired', issue: '-token_expired'}
        
        const verifyToken = await bcrypt.compare(refreshToken, token.token)
        
        if (!verifyToken) return {success: false, status: 401, message: 'Invalid refresh token', issue: '-token_invalid'}
        
        await Token.deleteOne({_id: token._id})
        
        return {success: true, status: 200, message: 'Refresh token revoked successfully'}
    
    }

    async genereteToken(user, tokenType) {

        await Token.deleteMany({user: user._id, type: tokenType})

        const token = crypto.randomBytes(32).toString("hex")

        const hashedToken = bcrypt.hashSync(token, AUTH.BCRYPT_SALT)

        await new Token({token: hashedToken, user: user._id, type: tokenType, expiredAt: CustomDate.now() + AUTH.TOKEN_EXPIRES_IN}).save()

        const finalToken = {token: token, user: user?._id}

        const excryptedToken = await this.encrypt(finalToken)

        return {success: true, status: 200, data: {token: excryptedToken.data}}

    }

    async verifyToken(tokenType, token) {

        const decryptedToken = await this.decrypt(token)

        if (!decryptedToken.status) return {success: false, status: 400, message: 'Token is invalid', issue: '-token_invalid'}

        const info = decryptedToken.data

        const findToken = await Token.findOne({user: info?.user, type: tokenType, expiredAt: {$gt: CustomDate.now()}})
        
        if (!findToken) return {success: false, status: 401, message: "Token is expired", issue: '-token_expired'}

        const verifyToken = await bcrypt.compareSync(info.token, findToken.token)
        
        if (!verifyToken) return {success: false, status: 401, message: 'Invalid URL', issue: '-url_expired'}
        
        await Token.deleteOne({_id: findToken._id})
        
        return {success: true, status: 200, message: 'URL verified successfully', data: findToken}
    
    }

    async encrypt(data) {
        
        const iv = crypto.randomBytes(12)
        
        const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv)

        let input = data
        
        if (typeof data !== 'string') input = JSON.stringify(data)

        const encrypted = Buffer.concat([cipher.update(input, 'utf8'), cipher.final()])
        
        const authTag = cipher.getAuthTag()

        const finalEncryption = `${iv.toString('hex')}:${encrypted.toString('hex')}:${authTag.toString('hex')}`

        return {success: true, status: 200, data: finalEncryption}
   
    }

    async decrypt(encryptedString) {
        
        const [ivHex, encryptedHex, authTagHex] = encryptedString.split(':')
        
        if (!ivHex || !encryptedHex || !authTagHex) return {success: false, status: 400, message: 'Invalid format'}
        
        const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, Buffer.from(ivHex, 'hex'))
        
        decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
        
        const decrypted = Buffer.concat([

            decipher.update(Buffer.from(encryptedHex, 'hex')),

            decipher.final()

        ])

        const text = decrypted.toString('utf8')

        try { 
            
            return {success: true, status: 200, data: JSON.parse(text)}
        
        } catch { 
            
            return {success: true, status: 200, data: text}
        
        }
    
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