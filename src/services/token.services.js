const crypto = require('crypto')
const bcrypt = require('bcrypt');
const config = require('../../config');
const { Token } = require('../models/token.model');
var jwt = require('jsonwebtoken');
const customDate = require('../utils/date');
const { User } = require('../models/user.model');

class tokenServices {
    async generateAuthToken(user) {

        const refreshToken = crypto.randomBytes(32).toString("hex");

        const hashedRefreshToken = bcrypt.hashSync(refreshToken, config.BCRYPT_SALT);

        await new Token({user: user._id, token: hashedRefreshToken, type: config.auth.tokens_types.refresh, expired_at: customDate.now + config.auth.jwt.REFRESH_TOKEN_EXPIRES_IN}).save()

        const accessTokenJwt = jwt.sign({ user_id: user._id, role: user.role, email: user.email }, config.auth.jwt.JWT_SECRET, { expiresIn: config.auth.jwt.TOKEN_EXPIRES_IN / 1000});

        const refreshTokenJwt = jwt.sign({ user_id: user._id, refresh_token: refreshToken}, config.auth.jwt.JWT_SECRET, { expiresIn: config.auth.jwt.REFRESH_TOKEN_EXPIRES_IN / 1000});

        return {success: true, status: 200, data: {token: accessTokenJwt, refresh_token: refreshTokenJwt}}
    }


    async refreshAuthToken(refresh_token_jwt) {

        const refreshTokenValue = jwt.verify(refresh_token_jwt, config.auth.jwt.JWT_SECRET)

        const findRefreshToken = await Token.find({user: refreshTokenValue?.user_id, type: config.auth.tokens_types.refresh})

        if (findRefreshToken.length === 0) return {success: false, status: 401, message: 'Refresh token is expired'}

        for (let i = 0; i < findRefreshToken.length; i++) {

            const token = findRefreshToken[i];
            
            const verifyToken = await bcrypt.compare(refreshTokenValue.refresh_token, token.token)

            if (verifyToken) {

                await Token.deleteOne({_id: token._id})

                const user = await User.findOne({_id: refreshTokenValue.user_id})

                return await this.generateAuthToken(user) 
            }
        }

        return {success: false, status: 401, message: 'Refresh token is invalid'}
    }


    async revokeRefreshToken(refresh_token_jwt) {

        const refreshTokenValue = jwt.verify(refresh_token_jwt, config.auth.jwt.JWT_SECRET)

        const findRefreshToken = await Token.find({user: refreshTokenValue?.user_id, type: config.auth.tokens_types.refresh})

        if (findRefreshToken.length === 0) return {success: false, status: 401, message: 'Refresh token is expired'}

        for (let i = 0; i < findRefreshToken.length; i++) {

            const token = findRefreshToken[i];
            
            const verifyToken = await bcrypt.compare(refreshTokenValue.refresh_token, token.token)

            if (verifyToken) {

                await Token.deleteOne({_id: token._id})

                return {success: true, status: 200, message: 'Refresh token revoke successful'}
            }
        }

        return {success: false, status: 401, message: 'Refresh token is invalid'}
    }


    async genereteToken(user, token_type) {

        await Token.deleteMany({user: user._id, type: token_type})

        const otp = crypto.randomBytes(3).readUInt16BE(0) % 1000000; //only numbers

        const code = otp.toString().padStart(6, (Math.floor(Math.random() * 9) + 1).toString()); // Ensure it's exactly 6 digits by left-padding with a number if necessary

        const token = crypto.randomBytes(32).toString("hex")

        const hashedCode = bcrypt.hashSync(code, config.BCRYPT_SALT)

        const hashedToken = bcrypt.hashSync(token, config.BCRYPT_SALT)

        await new Token({code: hashedCode, token: hashedToken, user: user._id, type: token_type, expired_at: customDate.now + config.auth.jwt.REFRESH_TOKEN_EXPIRES_IN}).save()

        return {success: true, status: 200, data: {code: code, token: token}}
    }


    async verifyToken(user, token_type, code, token) {

        const findToken = await Token.findOne({user: user._id, type: token_type})

        if (!findToken) return {success: false, message: "Token is exipred"}

        const verifyCode = bcrypt.compare(code, findToken.code)

        const verifyToken = bcrypt.compare(token, findToken.token)

        if (!verifyCode && !verifyToken) return {success: false, status: 401, message: 'Token and Code is Invalid'}

        await Token.deleteOne({user: user._id, type: token_type})

        return {success: true, status: 200, message: 'Token Verified Successful'}
    }
}

module.exports = new tokenServices