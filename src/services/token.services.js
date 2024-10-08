import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { CONFIG } from '../../config/index.js';
const AUTH = CONFIG.AUTH
import CustomDate from '../utils/date.js'
import Token from '../models/token.model.js';

class TokenServices {

    async generateAuthToken(user) {
        
        const refreshToken = crypto.randomBytes(32).toString("hex");

        const hashedRefreshToken = bcrypt.hashSync(refreshToken, AUTH.BCRYPT_SALT);

        await new Token({user: user._id, token: hashedRefreshToken, type: AUTH.TOKEN_TYPES.refresh, expiredAt: CustomDate.now() + AUTH.REFRESH_TOKEN_EXPIRES_IN}).save()

        const accessTokenJwt = jwt.sign({ user_id: user._id, role: user.role, email: user.email }, AUTH.JWT_SECRET, { expiresIn: AUTH.TOKEN_EXPIRES_IN / 1000});

        const refreshTokenJwt = jwt.sign({ user_id: user._id, refresh_token: refreshToken}, AUTH.JWT_SECRET, { expiresIn: AUTH.REFRESH_TOKEN_EXPIRES_IN / 1000});

        return {success: true, status: 200, data: {token: accessTokenJwt, refresh_token: refreshTokenJwt}}

    }


    async refreshAuthToken(refresh_token_jwt) {

        const refreshTokenValue = await this.decodeToken(refresh_token_jwt)

        if (!refreshTokenValue.status) return {success: false, status: 401, message: 'Refresh token is expired', issue: '-token_expired'}

        const findRefreshToken = await Token.find({user: refreshTokenValue.user.user_id, type: AUTH.TOKEN_TYPES.refresh})

        if (findRefreshToken.length === 0) return {success: false, status: 401, message: 'Refresh token is expired', issue: '-token_expired'}

        for (let i = 0; i < findRefreshToken.length; i++) {

            const token = findRefreshToken[i];
            
            const verifyToken = await bcrypt.compare(refreshTokenValue.user.refresh_token, token.token)

            if (verifyToken) {

                await Token.deleteOne({_id: token._id})

                const user = await User.findOne({_id: refreshTokenValue.user.user_id})

                return await this.generateAuthToken(user)

            }

        }

        return {success: false, status: 401, message: 'Refresh token is expired', issue: '-token_expired'}

    }


    async revokeRefreshToken(refresh_token_jwt) {

        const refreshTokenValue = await this.decodeToken(refresh_token_jwt)

        if (!refreshTokenValue.status) return {success: false, status: 401, message: 'Refresh token is expired', issue: '-token_expired'}

        const findRefreshToken = await Token.find({user: refreshTokenValue.user.user_id, type: AUTH.TOKEN_TYPES.refresh})

        if (findRefreshToken.length === 0) return {success: false, status: 401, message: 'Refresh token is expired', issue: '-token_expired'}

        for (let i = 0; i < findRefreshToken.length; i++) {

            const token = findRefreshToken[i];
            
            const verifyToken = await bcrypt.compare(refreshTokenValue.user.refresh_token, token.token)

            if (verifyToken) {

                await Token.deleteOne({_id: token._id})

                return {success: true, status: 200, message: 'Refresh token revoke successful'}
                
            }
            
        }

        return {success: false, status: 401, message: 'Refresh token is expired', issue: '-token_expired'}

    }


    async genereteToken(user, token_type) {

        await Token.deleteMany({user: user._id, type: token_type})

        const otp = crypto.randomBytes(3).readUInt16BE(0) % 1000000; //only numbers

        const code = otp.toString().padStart(6, (Math.floor(Math.random() * 9) + 1).toString()); // Ensure it's exactly 6 digits by left-padding with a number if necessary

        const token = crypto.randomBytes(32).toString("hex")

        const hashedCode = bcrypt.hashSync(code, AUTH.BCRYPT_SALT)

        const hashedToken = bcrypt.hashSync(token, AUTH.BCRYPT_SALT)

        await new Token({code: hashedCode, token: hashedToken, user: user._id, type: token_type, expiredAt: CustomDate.now() + AUTH.TOKEN_EXPIRES_IN}).save()

        return {success: true, status: 200, data: {code: code, token: token}}

    }


    async verifyToken(user, token_type, code, token) {

        const findToken = await Token.findOne({user: user._id, type: token_type})

        if (!findToken) return {success: false, status: 401, message: "Code or Token is exipred", issue: '-token_expired'}

        const verifyCode = await bcrypt.compare(code, findToken.code)

        const verifyToken = await bcrypt.compare(token || '', findToken.token)

        if (!token) {

            if (!verifyCode) return {success: false, status: 401, message: 'Code is Invalid', issue: '-code_invalid'}

            await Token.deleteOne({user: user._id, type: token_type})

            return {success: true, status: 200, message: 'Code Verified Successful'}

        }

        if (!verifyToken || !verifyCode) return {success: false, status: 401, message: 'Url is Invalid', issue: '-url_expired'}

        await Token.deleteOne({user: user._id, type: token_type})

        return {success: true, status: 200, message: 'Url Verified Successful'}

    }


    async decodeToken(token) {

        let result

        jwt.verify(token, AUTH.JWT_SECRET, function(err, decoded) {

            if (err) {

                result = {status: false, user: null}

            } else {

                result = {status: true, user: decoded}

            }

        });

        return result

    }
    
}

export default new TokenServices