import User from "../models/user.model.js";
import tokenServices from "../services/token.services.js";
import response from "../utils/response.js";
import customDate from '../utils/date.js'
import ValidationSchema from "../utils/validators.schema.js";
import { CONFIG } from "../../config/index.js";

class Auth {

    async apiGuard (req, res, next) {
    
        const { 'x-api-key': apiKey } = req.headers;

        if (apiKey !== CONFIG.AUTHORIZATION.ACCESS_KEY) return res.status(401).json(response(false, 'Unauthorized access', undefined, '-x-api-key-required'))

        next()

    }

    async authGuard (req, res, next) {

        const token = (req.headers.Authorization || req.headers.authorization).replace('Bearer ', '')

        if (!token) return res.status(401).json(response(false, 'Auth token is required', null, '-token-required'))

        const decodedToken = await tokenServices.decodeToken(token)

        if (!decodedToken.status) return res.status(401).json(response(false, 'Auth token expired', null, '-token-expired'))

        const {error, value: data} = ValidationSchema.getUser.validate({id: decodedToken.user.user_id})

        if (error) return {success: false, status: 400, message: error.message}

        const user = await User.findOne({_id: data.id}).populate({path: 'roles', populate: {path: 'privileges modules'}, select: '+privileges +modules'}).populate('country').select('+email_verified +lastSeen')

        if (!user) return res.status(404).json(response(false, 'User not found'))

        if (user.status === 'DISABLED' || user.status === 'INACTIVE') return res.status(401).json(response(false, 'Account disabled or inactive', null, '-account-disabled'))

        if (user.status === 'PENDING') return res.status(403).json(response(false, 'Email not verified', null, '-email-not-verified'))

        await User.updateOne({_id: data.id}, {lastSeen: customDate.now()})

        req.user = user;

        next()

    }

    checkPrivilege = (privilegeName) => (req, res, next) => {
        
        const user = req.user
        
        const hasPrivilege = user.roles.some(role => role.privileges.some(priv => priv.name === privilegeName))
        
        if (!hasPrivilege) return res.status(403).json(response(false, 'Insufficient privileges', null, '-insufficient-privileges'))
        
        next()
    
    }

}

export default new Auth